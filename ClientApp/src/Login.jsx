import React, { useState } from 'react';
import { useAuth } from './App';
import { login } from './authService';

const Login = () => {
    const { setRole } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password); // Call login API
            if (response.roles.includes('Admin')) {
                setRole('Admin');
                window.location.href = '/admin-dashboard'; // Redirect to admin dashboard
            } else if (response.roles.includes('Client')) {
                setRole('Client');
                window.location.href = '/client-dashboard'; // Redirect to client dashboard
            } else {
                setError('Unauthorized access');
            }
        } catch (err) {
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
