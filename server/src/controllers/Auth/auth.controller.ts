import { RequestHandler } from "express";
import { CreateUserForm, LoginUserForm, ManagerData } from "../../Types/AuthenticationTypes";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import { comparePassword, getHashPassword } from "../../Security/PasswordSecurity";
import { sendEmail } from "../../utils/Emails/EmailVerification/SendEmailVerification";
import { LinkData, UserVerification } from "../../Types/UserVerificationTypes";
import dayjs from "dayjs";
import redis from "../../connections/redis_conn";
import { generateRandomKey } from "../../Security/EncryptationModule";

const queriesFolder = path.join(__dirname, "./Queries")
const queries = getQueries(queriesFolder)
export const createUser: RequestHandler<{}, {}, CreateUserForm, {}> = async (
    req,
    res
): Promise<void> => {
    const {
        user_email,
        user_name,
        user_password,
    } = req.body
    let client;

    const createUserQuery = queries["createUser.sql"]
    try {
        client = await pool.connect();
        const hashedPassword = await getHashPassword(user_password)
        const result = await client.query(createUserQuery[0], [
            user_email,
            user_name,
            hashedPassword
        ])
        if (result.rowCount! > 0) {
            const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
            const linkResult = await client.query(createUserQuery[1], [
                result.rows[0].manager_id,
                "verification",
                now,
                dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss")
            ])
            await sendEmail({
                to: user_email,
                subject: "Verificación de correo en Fynkapp",
                user_name,
                user_id: result.rows[0].manager_id,
                link_id: linkResult.rows[0].link_id
            })
            res.status(200).json(result.rows[0])
            return;
        } else {
            res.status(400).json({
                msg: "Error desconocido al crear el usuario"
            })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error interno del servidor, espere unos segundos e intente nuevamente.'
        })
    } finally {
        if (client) client.release();
    }
}

export const userVerification: RequestHandler<{}, {}, {}, UserVerification> = async (req, res): Promise<void> => {
    const { manager_id, link_id } = req.query;
    let client;
    const UV = queries["userVerification.sql"]
    if (!UV) {
        console.error("❌ Error al obtener la consulta de verificación de usuario")
        res.redirect('/static/account-validation-error')
        return
    }
    try {
        client = await pool.connect();
        await client.query("BEGIN")
        const result = await client.query(UV[0], [link_id, manager_id, "verification"])
        if (result.rowCount! === 0) {
            throw new Error("Link no encontrado")
        }

        const linkData: LinkData = result.rows[0]

        if (linkData.used) {
            throw new Error("Link ya utilizado")
        }

        if (dayjs(linkData.expires_at).isBefore(dayjs())) {
            throw new Error("Link expirado")
        }

        if (manager_id !== linkData.manager_id) {
            throw new Error("Link no pertenece al usuario")
        }
        const result1 = await client.query(UV[1], [link_id])
        const result2 = await client.query(UV[2], [manager_id])

        if (result1.rowCount! === 0 || result2.rowCount! === 0) {
            throw new Error("Error al actualizar el usuario")
        }

        await client.query("COMMIT")
        res.redirect('/static/account-validation-success')
        return
    } catch (error) {
        console.log(error)
        client && await client.query("ROLLBACK")
        res.redirect('/static/account-validation-error')
        return;
    } finally {
        if (client) client.release();
    }
}

export const loginUser: RequestHandler<{}, {}, LoginUserForm, {}> = async (
    req,
    res
): Promise<void> => {
    let client;
    const { user_email, user_password } = req.body;
    const LU = queries["loginUser.sql"]
    if (!LU) {
        console.error("❌ Error al obtener las consultas de inicio de sesión")
        res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
        return
    }
    try {
        client = await pool.connect();
        const result1 = await client.query(LU[0], [user_email])
        if (result1.rowCount! === 0) {
            res.status(404).json({ msg: "El correo ingresado no es válido o no se encuentra registrado." })
            return
        }

        const managerData: ManagerData = result1.rows[0]

        if (managerData.manager_verified === false) {
            const linkQueries = queries["createUser.sql"]
            const linkResult = await pool.query(linkQueries[1], [
                managerData.manager_id,
                "verification",
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss")
            ])

            await sendEmail({
                to: user_email,
                subject: "Verificación de correo en Fynkapp",
                user_name: managerData.manager_name,
                user_id: managerData.manager_id,
                link_id: linkResult.rows[0].link_id
            })
            res.statusMessage = "El correo ingresado no ha sido verificado, se le envió un correo de verificación.."
            res.status(400).send()
            return
        } else if (await comparePassword(managerData.manager_password, user_password)) {
            res.status(401).json({ msg: "La contraseña ingresada es incorrecta." })
            return
        }
        const redis_key = generateRandomKey(64)

        const redis_user_key = `user_token:${redis_key}`
        const managerDataProfile: Partial<ManagerData> = {
            manager_id: managerData.manager_id,
            manager_name: managerData.manager_name,
            manager_email: managerData.manager_email,
        }
        await redis.hset(redis_user_key, managerDataProfile)
        await redis.expire(redis_user_key, 60 * 60)
        managerDataProfile.token = redis_key
        res.status(200).json(managerDataProfile)
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
    } finally {
        if (client) {
            client.release();
        }
    }
}