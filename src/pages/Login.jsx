import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const res = login(email, password);
        if (res.success) {
            if (res.role === 'admin') navigate('/admin');
            else navigate('/employee');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="login-container">
            <div className="card login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <LogIn size={32} color="var(--primary-color)" />
                    </div>
                    <h2>HR Management</h2>
                    <p>Login to your account</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@company.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary login-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <p><strong>Demo Admin:</strong> admin@company.com / password</p>
                    <p><strong>Demo Employee:</strong> john@company.com / password</p>
                </div>
            </div>
        </div>
    );
}
