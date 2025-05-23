import "./Sidebar.css"
import { useAppContext } from "../../../../Context/AppContext"
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { IoStatsChart } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { Button, Loader } from "@mantine/core";
function Sidebar({ mobileExtended, setMobileExtended }) {
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
                            color="red"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            {isClosing ? <Loader size={20} type="dots" color="#white"/> : <IoLogOutOutline size={20}  color="white"/>}
                        </button>
                        <p className='sidebar-logo'
                            style={{alignSelf: "flex-start"}}
                        >Fynkapp <FaMoneyBillTransfer /> </p>
                        <p className='sidebar-logo' style={{alignSelf: "flex-start", fontSize: "1.1rem"}}>Hola, {loginData &&loginData.user_name.split(" ")[0] || "Usuario"} 👋 </p>

                        <li className='sidebar-list' onClick={() => {
                            openAddClientModal()
                            setMobileExtended(false)
                        }}><MdOutlinePersonAddAlt1 size={20} /><span>Agregar cliente</span></li>
                        {/* <li className='sidebar-list' onClick={() => {
                            openDeliverModal()
                            setMobileExtended(false)
                        }}><GiTakeMyMoney size={20} /><span>Agregar Entrega</span></li>
                        <li className='sidebar-list' onClick={() => {
                            openDebtModal()
                            setMobileExtended(false)
                        }}><TbReportMoney size={20} /><span>Nueva deuda</span></li> */}
                        <div className='sidebar-divider'></div>
                        <p className='sidebar-title'>Reportes (Próximamente)</p>
                        <li className='sidebar-list disabled'><IoStatsChart size={20} /><span>Análisis de Clientes</span></li>
                        <li className='sidebar-list disabled'><HiOutlineDocumentReport size={20} /><span>Resumen mensual</span></li>
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
                                <Loader size={20} color="#2c2c2c" type="dots"/>
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
                                    {/* <li className='sidebar-list' onClick={() => {
                                        openDeliverModal()
                                        setMobileExtended(false)
                                    }}><GiTakeMyMoney size={20} /><span>Agregar Entrega</span></li>
                                    <li className='sidebar-list' onClick={() => {
                                        openDebtModal()
                                        setMobileExtended(false)
                                    }}><TbReportMoney size={20} /><span>Nueva deuda</span></li> */}
                                    <li className='sidebar-list disabled'><IoStatsChart size={20} /><span>Análisis de Clientes</span></li>
                                    <li className='sidebar-list disabled'><HiOutlineDocumentReport size={20} /><span>Resumen mensual</span></li>
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
