import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getUsers, getAttendance } from '../services/db';
import { format, subDays } from 'date-fns';
import { Users, UserX, Clock, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        const users = getUsers().filter(u => u.role === 'employee');
        const logs = getAttendance();
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        let present = 0;
        let late = 0;

        users.forEach(user => {
            const todayLog = logs.find(l => l.userId === user.id && l.date === todayStr);
            if (todayLog) {
                if (todayLog.status === 'Present') present++;
                else if (todayLog.status === 'Late') late++;
            }
        });

        const absent = users.length > 0 ? users.length - (present + late) : 0;
        setStats({ total: users.length, present, absent, late });

        setDailyData([
            { name: 'Present', value: present, color: '#10b981' },
            { name: 'Late', value: late, color: '#f59e0b' },
            { name: 'Absent', value: absent, color: '#ef4444' },
        ]);

        // Generate mock weekly data
        const week = [];
        for (let i = 6; i >= 0; i--) {
            const d = subDays(new Date(), i);
            week.push({
                day: format(d, 'EEE'),
                Present: Math.floor(Math.random() * (users.length - 1)) + 1,
                Late: Math.floor(Math.random() * 2),
                Absent: Math.floor(Math.random() * 2)
            });
        }
        setWeeklyData(week);

    }, []);

    return (
        <Layout>
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Overview of today's attendance metrics</p>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-color)', color: 'white' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Employees</h3>
                        <p className="stat-value">{stats.total}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-color)', color: 'white' }}>
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Present Today</h3>
                        <p className="stat-value text-success">{stats.present}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-color)', color: 'white' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Late Arrivals</h3>
                        <p className="stat-value text-warning">{stats.late}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--danger-color)', color: 'white' }}>
                        <UserX size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Absent Today</h3>
                        <p className="stat-value text-danger">{stats.absent}</p>
                    </div>
                </div>
            </div>

            <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card">
                    <h3 className="card-title mb-2">Today's Distribution</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dailyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dailyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title mb-2">Weekly Overview</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <ChartTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="Present" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
