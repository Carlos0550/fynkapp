import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';
import { Icons } from '../Context/IconsManager';
import { LuCalendarX2, LuClockAlert, LuSettings } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { MdSpaceDashboard, MdGroups2 } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff, IoMdPersonAdd } from "react-icons/io";
import { useAppContext } from '../Context/AppContext';
import { Button, Divider, Popover } from '@mantine/core';
import FastAddClientModal from '../FastActions/AddClient/FastAddClientModal';

import FastRegisterPaymentModal from '../FastActions/RegisterPayment/FastRegisterPaymentModal';
const Layout = ({ content }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { width, authHook } = useAppContext()
    const [openClientFormModal, setOpenClientFormModal] = useState(false)
    const [openFastRegisterPaymentModal, setOpenFastRegisterPaymentModal] = useState(false)

    const { loginData, handleCloseSession } = authHook

    const navigate = useNavigate()

    useEffect(() => {
        if(width > 768) setSidebarOpen(true)
    }, [width])
    return (
        <div className="layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="icon icon-logo">{Icons.icons.WalletIcon}</span>
                    <h1 className="text">Fynkapp</h1>
                </div>

                <nav className="sidebar-nav">
                    {sidebarOpen && (
                        <Divider 
                            color="gray"
                            size="sm"
                            my="md"
                            mx="xs"
                            label="Acciones Rápidas"
                            labelPosition="center"
                            styles={{
                                label: {
                                    color: "#000000",
                                    fontSize: "18px",
                                    fontWeight: "600"
                                }
                            }}
                        />
                    )}
                    <button
                        onClick={() => setOpenFastRegisterPaymentModal(true)}
                    >
                        <span className="icon"><FaRegCreditCard /></span>
                        <span className="text">Registrar pago</span>
                    </button>
                    <button
                        onClick={() => setOpenClientFormModal(true)}
                    >
                        <span className="icon"><IoMdPersonAdd /></span>
                        <span className="text">Nuevo cliente</span>
                    </button>

                    {width > 768 && (
                        <Divider 
                            color="gray"
                            size="sm"
                            my="md"
                            mx="xs"
                            label="General"
                            labelPosition="center"
                            styles={{
                                label: {
                                    color: "#000000",
                                    fontSize: "18px",
                                    fontWeight: "600"
                                }
                            }}
                        />
                    )}

                    <Link to="/">
                        <span className="icon"><MdSpaceDashboard /></span>
                        <span className="text">Dashboard</span>
                    </Link>
                    <Link to="/clients">
                        <span className="icon"><MdGroups2 /></span>
                        <span className="text" onClick={() => navigate("/clients/new")}>Clientes/Deudas</span>
                    </Link>

                    {width > 768 && (
                        <Divider 
                            color="gray"
                            size="sm"
                            my="md"
                            mx="xs"
                            label="Vencimientos"
                            labelPosition="center"
                            styles={{
                                label: {
                                    color: "#000000",
                                    fontSize: "18px",
                                    fontWeight: "600"
                                }
                            }}
                        />
                    )}

                    <button className="yellow">
                        <span className="icon"><LuClockAlert /></span>
                        <span className="text">Por vencer este mes</span>
                    </button>
                    <button className="red">
                        <span className="icon"><LuCalendarX2 /></span>
                        <span className="text">Vencidas</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <p className="text">{loginData?.user_name}</p>
                        <p className="email text">{loginData?.user_email.slice(0, 20) + "..."}</p>
                    </div>
                    <Popover>
                        <Popover.Target>
                            <span className="icon"><LuSettings size={24} /></span>
                        </Popover.Target>
                        <Popover.Dropdown style={{
                            border: "1px solid #ccc",
                            borderRadius: ".5rem",
                            backgroundColor: "#e3e3e3",
                        }}>
                            <Button color='red' onClick={()=> handleCloseSession()}>Cerrar sesión</Button>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            </aside>

            <main className="main-content"
                
            >
                {width < 768 && (
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className='sidebar-toggle-btn'>
                        {sidebarOpen ? <IoMdEye size={26} /> : <IoMdEyeOff size={26} />}
                    </button>
                )}
                <div
                    style={{
                        filter: sidebarOpen && width > 768 ? "none" : width < 768 && !sidebarOpen ? "none" : "blur(7px)",
                        transition: "all 0.1s ease"
                    }}
                >
                    {content}
                </div>
                {openClientFormModal && <FastAddClientModal closeModal={() => setOpenClientFormModal(false)}/>}
                {openFastRegisterPaymentModal && <FastRegisterPaymentModal closeModal={() => setOpenFastRegisterPaymentModal(false)}/>}
            </main>
        </div>
    );
};

export default Layout;
