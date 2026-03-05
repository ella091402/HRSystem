import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getUsers, saveUsers } from '../services/db';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export default function AdminEmployees() {
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', password: '', role: 'employee', department: '' });

    useEffect(() => {
        setEmployees(getUsers().filter(u => u.role === 'employee'));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allUsers = getUsers();
        let updated;
        if (isEditing) {
            updated = allUsers.map(u => u.id === formData.id ? { ...u, ...formData } : u);
        } else {
            const newEmployee = { ...formData, id: Date.now(), leaveBalance: { SL: 10, VL: 15, EL: 5 } };
            updated = [...allUsers, newEmployee];
        }
        saveUsers(updated);
        setEmployees(updated.filter(u => u.role === 'employee'));
        handleCancel();
    };

    const handleEdit = (emp) => {
        setFormData(emp);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            const allUsers = getUsers();
            const updated = allUsers.filter(u => u.id !== id);
            saveUsers(updated);
            setEmployees(updated.filter(u => u.role === 'employee'));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ id: '', name: '', email: '', password: '', role: 'employee', department: '' });
    };

    return (
        <Layout>
            <div className="dashboard-header">
                <h1>Employee Management</h1>
                <p>Add, edit or remove employee records</p>
            </div>

            <div className="card mb-2">
                <h3 className="card-title mb-1">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group mb-1">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group mb-1">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group mb-1">
                            <label className="form-label">Password</label>
                            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required={!isEditing} />
                        </div>
                        <div className="form-group mb-1">
                            <label className="form-label">Department</label>
                            <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">
                            <UserPlus size={18} /> {isEditing ? 'Update Employee' : 'Add Employee'}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 className="card-title mb-1">Employee Directory</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-icon" onClick={() => handleEdit(emp)} title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button className="btn-icon text-danger" onClick={() => handleDelete(emp.id)} title="Delete" style={{ color: 'var(--danger-color)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No employees found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
