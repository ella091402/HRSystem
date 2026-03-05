import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, initDB } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initDB();
        const storedUser = localStorage.getItem('hrms_currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const { password, ...safeUser } = foundUser;
            setUser(safeUser);
            localStorage.setItem('hrms_currentUser', JSON.stringify(safeUser));
            return { success: true, role: safeUser.role };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hrms_currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
