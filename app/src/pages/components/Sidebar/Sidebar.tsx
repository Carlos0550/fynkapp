import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { useAppContext } from "../../../Context/AppContext"
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";
import { FaUserClock } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
function Sidebar({ mobileExtended, setMobileExtended }) {
    const {
        width,
        modalsHook: {
            openAddClientModal,
            openDeliverModal,
            openDebtModal,
        }
    } = useAppContext()

    return (
        <div className='sidebar-container'>
            {width > 768
                ? (
                    <ul className='sidebar'>
                        <p className='sidebar-logo'>Fynkapp <FaMoneyBillTransfer /></p>
                        <li className='sidebar-list' onClick={() => {
                            openAddClientModal()
                            setMobileExtended(false)
                        }}><MdOutlinePersonAddAlt1 size={20} /><span>Agregar cliente</span></li>
                        <li className='sidebar-list' onClick={() => {
                            openDeliverModal()
                            setMobileExtended(false)
                        }}><GiTakeMyMoney size={20} /><span>Agregar Entrega</span></li>
                        <li className='sidebar-list' onClick={() =>{
                            openDebtModal()
                            setMobileExtended(false)
                        }}><TbReportMoney size={20} /><span>Nueva deuda</span></li>
                        <div className='sidebar-divider'></div>
                        <p className='sidebar-title'>Reportes</p>
                        <li className='sidebar-list'><FaUserClock size={20} /><span>Vencimientos</span></li>
                        <li className='sidebar-list'><HiOutlineDocumentReport size={20} /><span>Resumen mensual</span></li>
                    </ul>
                )
                : (
                    <div className={`sidebar-mobile ${mobileExtended ? "extended" : ""}`}>
                        <p className='sidebar-logo'>Fynkapp <FaMoneyBillTransfer /></p>
                        {width <= 768 && (
                            <li className="sidebar-menu-icon" onClick={() => setMobileExtended(!mobileExtended)}>
                                <IoMenu size={20} />
                                <span></span>
                            </li>
                        )}
                        <ul className='sidebar-mobile-list'>

                            {width <= 768 && (
                                <>
                                    <li className='sidebar-list' onClick={() => {
                                        openAddClientModal()
                                        setMobileExtended(false)
                                    }}><MdOutlinePersonAddAlt1 size={20} /><span>Agregar cliente</span></li>
                                    <li className='sidebar-list' onClick={() => {
                                        openDeliverModal()
                                        setMobileExtended(false)
                                    }}><GiTakeMyMoney size={20} /><span>Agregar Entrega</span></li>
                                    <li className='sidebar-list' onClick={() => {
                                        openDebtModal()
                                        setMobileExtended(false)
                                    }}><TbReportMoney size={20} /><span>Nueva deuda</span></li>
                                    <li className='sidebar-list'><FaUserClock size={20} /><span>Vencimientos</span></li>
                                    <li className='sidebar-list'><HiOutlineDocumentReport size={20} /><span>Resumen mensual</span></li>
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
