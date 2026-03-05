import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getTodayStatus, getUserAttendance } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, CheckCircle } from 'lucide-react';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [todayStatus, setTodayStatus] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);

    useEffect(() => {
        if (user) {
            setTodayStatus(getTodayStatus(user.id));
            const logs = getUserAttendance(user.id);
            setRecentLogs(logs.slice(0, 5)); // show last 5
        }
    }, [user]);

    return (
        <Layout>
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
                <p>Here's your attendance overview for today.</p>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-color)', color: 'white' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Time In</h3>
                        <p className="stat-value">{todayStatus?.timeIn || '--:--'}</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-color)', color: 'white' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Time Out</h3>
                        <p className="stat-value">{todayStatus?.timeOut || '--:--'}</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-color)', color: 'white' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Today's Status</h3>
                        <p className={`stat-value ${todayStatus?.status === 'Late' ? 'text-danger' : 'text-success'}`}>
                            {todayStatus ? todayStatus.status : 'Pending'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card mt-2">
                <h3 className="card-title">Recent Attendance Logs</h3>
                <div className="table-container mt-1">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLogs.length > 0 ? (
                                recentLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.date}</td>
                                        <td>{log.timeIn}</td>
                                        <td>{log.timeOut || '--:--'}</td>
                                        <td>
                                            <span className={`badge badge-${log.status === 'Present' ? 'success' : (log.status === 'Late' ? 'danger' : 'warning')}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No recent logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
