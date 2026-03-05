import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plane, Pill } from 'lucide-react';

export default function EmployeeLeave() {
    const { user } = useAuth();
    const balances = user?.leaveBalance || { SL: 0, VL: 0, EL: 0 };

    return (
        <Layout>
            <div className="dashboard-header">
                <h1>Leave Balance</h1>
                <p>View your remaining leave credits</p>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--danger-color)', color: 'white' }}>
                        <Pill size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Sick Leave (SL)</h3>
                        <p className="stat-value">{balances.SL} days</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-color)', color: 'white' }}>
                        <Plane size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Vacation Leave (VL)</h3>
                        <p className="stat-value">{balances.VL} days</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-color)', color: 'white' }}>
                        <ShieldAlert size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Emergency Leave (EL)</h3>
                        <p className="stat-value">{balances.EL} days</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
