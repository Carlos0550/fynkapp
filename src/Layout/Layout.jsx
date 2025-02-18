import React, { useState, useEffect } from 'react';
import "./layout.css";
import { Icons } from '../Context/IconsManager';
import { useAppContext } from '../Context/AppContext';

function Layout({ content }) {
    const [openSideBar, setOpenSideBar] = useState(false);
    const { width } = useAppContext();
    const [sidebarWidth, setSidebarWidth] = useState(5); 

    useEffect(() => {
        const getSidebarWidth = () => {
            if (width < 768) return openSideBar ? 50 : 10;
            return openSideBar ? 15 : 5;
        };
        setSidebarWidth(getSidebarWidth()); 
    }, [width, openSideBar]);

    const toggleSidebar = () => setOpenSideBar(prev => !prev);

    return (
        <div className='layout-parent'>
            <div
                style={{ width: `${sidebarWidth}%` }}
                className='layout-sidebar'
            >
                <span className='layout-sidebar-icon' onClick={toggleSidebar}>
                    {openSideBar ? Icons?.icons?.closeEye : Icons?.icons?.openEye}
                </span>
            </div>
            <div className='layout-content'>{content}</div>
        </div>
    );
}

export default Layout;
