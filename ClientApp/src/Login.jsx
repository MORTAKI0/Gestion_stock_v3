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

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#f4f4f9',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
        },
        heading: {
            fontSize: '2rem',
            marginBottom: '20px',
            color: '#333',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
            fontSize: '1rem',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        input: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
        },
        button: {
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007BFF',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Login</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;