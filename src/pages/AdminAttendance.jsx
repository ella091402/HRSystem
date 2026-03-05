import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getAttendance, getUsers } from '../services/db';
import ExportButtons from '../components/ExportButtons';

export default function AdminAttendance() {
    const [logs, setLogs] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const users = getUsers();
        const depts = [...new Set(users.filter(u => u.role === 'employee').map(u => u.department))];
        setDepartments(depts);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [filterDate, filterDept]);

    const fetchLogs = () => {
        let allLogs = getAttendance();
        const users = getUsers();

        // attach department to logs for filtering
        allLogs = allLogs.map(log => {
            const user = users.find(u => u.id === log.userId);
            return { ...log, department: user ? user.department : 'Unknown' };
        });

        if (filterDate) {
            allLogs = allLogs.filter(l => l.date === filterDate);
        }
        if (filterDept) {
            allLogs = allLogs.filter(l => l.department === filterDept);
        }

        // Sort by most recent
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(allLogs);
    };

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Employee', key: 'userName' },
        { header: 'Department', key: 'department' },
        { header: 'Date', key: 'date' },
        { header: 'Time In', key: 'timeIn' },
        { header: 'Time Out', key: 'timeOut' },
        { header: 'Status', key: 'status' }
    ];

    const exportData = logs.map(log => ({
        id: log.id,
        userName: log.userName,
        department: log.department,
        date: log.date,
        timeIn: log.timeIn || 'N/A',
        timeOut: log.timeOut || 'N/A',
        status: log.status
    }));

    return (
        <Layout>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Attendance Records</h1>
                    <p>View and export all employee attendance logs</p>
                </div>
                <ExportButtons data={exportData} columns={columns} filename={`Attendance_Report_${filterDate || 'All'}`} />
            </div>

            <div className="card mb-2">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>Filter Date:</label>
                        <input
                            type="date"
                            className="form-input"
                            style={{ width: 'auto' }}
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>Filter Department:</label>
                        <select
                            className="form-input"
                            style={{ width: 'auto' }}
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {(filterDate || filterDept) && (
                        <button className="btn btn-secondary" onClick={() => { setFilterDate(''); setFilterDept(''); }}>Clear Filters</button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {columns.map(c => (
                                    <th key={c.key}>{c.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.id}</td>
                                    <td><strong>{log.userName}</strong></td>
                                    <td>{log.department}</td>
                                    <td>{log.date}</td>
                                    <td>{log.timeIn || '--:--'}</td>
                                    <td>{log.timeOut || '--:--'}</td>
                                    <td>
                                        <span className={`badge badge-${log.status === 'Present' ? 'success' : (log.status === 'Late' ? 'danger' : 'warning')}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center">No attendance records found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
