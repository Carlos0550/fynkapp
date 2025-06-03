import { RequestHandler, Router } from "express";
import { CreateUserForm, LoginUserForm, ManagerData } from "../Types/AuthenticationTypes";
import pool from "../connections/database_conn";
import validator from "validator"
import { createUser, loginUser, userVerification } from "../controllers/Auth/auth.controller";
import { UserVerification } from "../Types/UserVerificationTypes";
import redis from "../connections/redis_conn";
const authRouter = Router()

const CreateUserRouter: RequestHandler<{}, {}, CreateUserForm, {}> = async (
    req,
    res,
    next
): Promise<void> => {
    const {
        user_email,
        user_name,
        user_password,
        confirm_password
    } = req.body;

    if (!user_email || !user_name || !user_password || !confirm_password) {
        res.status(400).json({ msg: 'Todos los campos son obligatorios, revise los que están con "*".' });
        return;
    }

    if (!validator.isEmail(user_email)) {
        res.status(400).json({ msg: 'El correo ingresado no es válido.' });
        return;
    }

    const strongPasswordOptions = {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 1
    };
    if (!validator.isStrongPassword(user_password, strongPasswordOptions)) {
        res.status(400).json({ msg: 'La contraseña ingresada no es segura, debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un caracter especial.' });
        return;
    }

    if (user_password.trim() !== confirm_password.trim()) {
        res.status(400).json({ msg: 'Las contraseñas no coinciden.' });
        return;
    }

    if (user_name.trim().length < 3) {
        res.status(400).json({ msg: 'El nombre de usuario debe tener al menos 3 caracteres.' });
        return;
    }

    try {
        const verificationResult = await pool.query(
            "SELECT COUNT(*) FROM managers WHERE manager_email = $1", [user_email]
        );

        const managersCount = verificationResult.rows[0].count;
        if (managersCount > 0) {
            res.status(400).json({ msg: 'El correo ingresado ya se encuentra registrado.' });
            return;
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor, espere unos segundos e intente nuevamente.' });
        return;
    }
};

const UserVerificationRouter: RequestHandler<{}, {}, {}, UserVerification> = async (req, res, next): Promise<void> => {
    const { manager_id, link_id } = req.query;
    if (!manager_id || !link_id) {
        res.status(400).json({ msg: 'Link de verificación no válido.' });
        return;
    }

    next();
}

const LoginUserRouter: RequestHandler<{}, {}, LoginUserForm, {}> = async (
    req,
    res,
    next
): Promise<void> => {
    const { user_email, user_password } = req.body;
    if (!user_email || !user_password) {
        res.status(400).json({ msg: 'Todos los campos son obligatorios, revise los que están con "*".' });
        return;
    }

    if (!validator.isEmail(user_email)) {
        res.status(400).json({ msg: 'El correo ingresado no es válido.' });
        return;
    }
    next();
}

export const ValidateSessionRouter: RequestHandler = async (
    req, res, next
): Promise<void> => {
    const authHeader = req.headers.authorization?.split(" ")[1];
    
    if (!authHeader) {
        res.status(401).json({ msg: 'Acceso no autorizado.' });
        return;
    }

    const redis_key = `user_token:${authHeader}`
    const keyExists = await redis.exists(redis_key);

    if (keyExists === 0) {
        res.status(403).json({ msg: 'Sesión expirada o no válida.' });
        return;
    }
    const managerData: Partial<ManagerData> = await redis.hgetall(redis_key);

    if (Object.keys(managerData).length === 0) {
        res.status(403).json({ msg: 'Sesión expirada o no válida.' });
        return;
    }
    (req as any).manager_data = managerData
    next()
}

const LogoutUserRouter: RequestHandler = async (req, res, next): Promise<void> => {
    const authHeader = req.headers.authorization?.split(" ")[1];
    if (!authHeader) {
        res.status(401).json({ msg: 'Token no válido.' });
        return;
    }
    const token = authHeader
    await redis.del(`user_token:${token}`)
    res.status(200).json({ msg: "Logout exitoso" })
}

authRouter.post("/create-user", CreateUserRouter, createUser)
authRouter.get("/user-verification", UserVerificationRouter, userVerification)
authRouter.post("/login-user", LoginUserRouter, loginUser)
authRouter.post("/logout-user", LogoutUserRouter)
authRouter.get("/validate-session", ValidateSessionRouter, (req, res) => {
    if ((req as any).manager_data) {
        res.status(200).json((req as any).manager_data)
        return 
    }else{
        res.status(401).json({ msg: 'Acceso no autorizado.' })
        return;
    }
})
export default authRouter