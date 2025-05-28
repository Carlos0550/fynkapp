import "./Sidebar.css"
import { useAppContext } from "../../Context/AppContext"
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { IoStatsChart } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { useState } from "react";
import { Loader } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
function Sidebar({ mobileExtended, setMobileExtended }) {
    const navigate = useNavigate()
    const location = useLocation();

    const {
        width,
        modalsHook: {
            openAddClientModal
        },
        authHook: {
            loginData,
            logoutUser
        }
    } = useAppContext()

    const [isClosing, setIsClosing] = useState(false)
    const handleLogout = async () => {
        setIsClosing(true)
        await logoutUser()
        setIsClosing(false)
    }


    return (
        <div className='sidebar-container'>
            {width > 768
                ? (
                    <ul className='sidebar'>
                        <button
                            style={{ backgroundColor: isClosing ? "maroon" : "inherit" }}
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            {isClosing ? <Loader size={20} type="dots" color="white" /> : <IoLogOutOutline size={20} color="black" />}
                        </button>
                        <p className='sidebar-logo'
                            style={{ alignSelf: "flex-start" }}
                        >Fynkapp <FaMoneyBillTransfer /> </p>
                        <p className='sidebar-logo' style={{ alignSelf: "flex-start", fontSize: "1.1rem" }}>Hola, {loginData && loginData.user_name.split(" ")[0] || "Usuario"} 👋 </p>

                        <li className='sidebar-list' onClick={() => {
                            openAddClientModal()
                            setMobileExtended(false)
                        }}><MdOutlinePersonAddAlt1 size={20} /><span>Agregar cliente</span></li>
                        <div className='sidebar-divider'></div>

                        <li
                            className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
                            onClick={() => navigate("/")}
                        >
                            <IoHome size={20} /> Inicio
                        </li>
                        <li
                            className={`sidebar-list ${location.pathname === "/monthly-resume" ? "active" : ""}`}
                            onClick={() => navigate("/monthly-resume")}
                        >
                            <HiOutlineDocumentReport size={20} />
                            <span>Resumen mensual</span>
                        </li>
                        {/* <div className='sidebar-divider'></div>
                        <p className='sidebar-title'>Analíticas (Próximamente)</p>
                        <li className='sidebar-list disabled'><IoStatsChart size={20} /><span>Análisis de Clientes</span></li> */}
                    </ul>
                )
                : (
                    <div className={`sidebar-mobile ${mobileExtended ? "extended" : ""}`}>
                        <p className='sidebar-logo'>Hola, {loginData.user_name.split(" ")[0] || "Usuario"} 👋</p>

                        <li className="sidebar-menu-icon" onClick={() => setMobileExtended(!mobileExtended)}>
                            <IoMenu size={20} />
                            <span></span>
                        </li>

                        <li className="sidebar-menu-icon logout" onClick={() => handleLogout()}>
                            {isClosing ? (
                                <Loader size={20} color="#2c2c2c" type="dots" />
                            ) : (
                                <IoLogOutOutline size={20} />
                            )}
                            <span></span>
                        </li>

                        <ul className='sidebar-mobile-list'>

                            {width <= 768 && (
                                <>
                                    <li className='sidebar-list' onClick={() => {
                                        openAddClientModal()
                                        setMobileExtended(false)
                                    }}><MdOutlinePersonAddAlt1 size={20} /><span>Agregar cliente</span></li>

                                    <li
                                        className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
                                        onClick={() => {
                                            navigate("/")
                                            setMobileExtended(false)
                                        }}
                                    >
                                        <IoHome size={20} /> Inicio
                                    </li>
                                    <li
                                        className={`sidebar-list ${location.pathname === "/monthly-resume" ? "active" : ""}`}
                                        onClick={() => {
                                            navigate("/monthly-resume")
                                            setMobileExtended(false)
                                        }}
                                    >
                                        <HiOutlineDocumentReport size={20} />
                                        <span>Resumen mensual</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar
