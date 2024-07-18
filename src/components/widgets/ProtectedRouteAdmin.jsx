import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import NavbarAdmin from './NavbarAdmin';
import SidebarAdmin from './SidebarAdmin';

const ProtectedRouteAdmin = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children ? children : (
        <section className="relative">
            <div className="fixed top-0 left-0 h-screen bg-sidebar sidebar-width">
                < SidebarAdmin />
            </div>


            <div className="main-width md:pr-4">
                <NavbarAdmin />
                <Outlet />
            </div>
        </section>
    );
}

export default ProtectedRouteAdmin