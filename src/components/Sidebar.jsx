import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Clock, FileText, Users, LogOut, ChartPie } from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

    const menuItems = isAdmin ? [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <Users size={20} />, label: 'Employees', path: '/admin/employees' },
        { icon: <FileText size={20} />, label: 'Attendance Records', path: '/admin/attendance' },
    ] : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/employee' },
        { icon: <Clock size={20} />, label: 'Time Tracking', path: '/employee/attendance' },
        { icon: <ChartPie size={20} />, label: 'Leave Balance', path: '/employee/leave' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>HR System</h2>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        end={item.path === '/admin' || item.path === '/employee'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="btn btn-secondary logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
