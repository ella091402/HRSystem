import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell } from 'lucide-react';

export default function Topbar() {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <div className="topbar-search">
                {/* Search could go here */}
            </div>
            <div className="topbar-actions">
                <button className="btn-icon">
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
