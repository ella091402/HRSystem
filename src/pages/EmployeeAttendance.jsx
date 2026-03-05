import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { checkIn, checkOut, getTodayStatus, getUserAttendance } from '../services/db';

export default function EmployeeAttendance() {
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadData = () => {
        setStatus(getTodayStatus(user.id));
        setLogs(getUserAttendance(user.id));
    };

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const handleAction = (type) => {
        setError('');
        setSuccess('');
        try {
            if (type === 'in') {
                checkIn(user.id);
                setSuccess('Successfully checked in!');
            } else {
                checkOut(user.id);
                setSuccess('Successfully checked out!');
            }
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
            <div className="dashboard-header">
                <h1>Time Tracking</h1>
                <p>Record your daily attendance</p>
            </div>

            <div className="card mb-2">
                <h3 className="card-title mb-1">Today's Actions</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success" style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>{success}</div>}

                <div className="flex gap-1" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleAction('in')}
                        disabled={status?.timeIn !== undefined && status?.timeIn !== null}
                    >
                        Time In
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleAction('out')}
                        disabled={!status?.timeIn || status?.timeOut}
                    >
                        Time Out
                    </button>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                    <p><strong>Status:</strong> {status ? status.status : 'Not logged yet'}</p>
                    <p><strong>Time In:</strong> {status?.timeIn || '--:--'}</p>
                    <p><strong>Time Out:</strong> {status?.timeOut || '--:--'}</p>
                </div>
            </div>

            <div className="card mt-2">
                <h3 className="card-title">Full Attendance History</h3>
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
                            {logs.map(log => (
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
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
