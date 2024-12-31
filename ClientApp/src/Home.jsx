import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Optional: Add CSS for styling

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = (action) => {
        if (action === 'Login') {
            navigate('/login'); // Navigate to Login page
        } else if (action === 'Register') {
            navigate('/register'); // Navigate to Register page
        } else if (action === 'Manage Products') {
            navigate('/manage-products'); // Navigate to Manage Products page
        } else if (action === 'View Reports') {
            navigate('/view-reports'); // Navigate to View Reports page
        } else if (action === 'Settings') {
            navigate('/settings'); // Navigate to Settings page
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1> L7WAAAA KHDEM - Welcome to Gestion Stock V2</h1>
            <p>This is the sweet home page of your application.</p>

            {/* Authentication Section */}
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                <h2>Authentication</h2>
                <button
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#17A2B8',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleButtonClick('Login')}
                >
                    Login
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#FFC107',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleButtonClick('Register')}
                >
                    Register
                </button>
            </div>

            {/* Main Navigation Section */}
            <div>
                <button
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleButtonClick('Manage Products')}
                >
                    Manage Products
                </button>

                <button
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#28A745',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleButtonClick('View Reports')}
                >
                    View Reports
                </button>

                <button
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#DC3545',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleButtonClick('Settings')}
                >
                    Settings
                </button>
            </div>

            {/* About Us Section */}
            <div style={{ marginTop: '30px' }}>
                <h2>About Us</h2>
                <p>
                    Gestion Stock V2 is an advanced stock management system designed to help you
                    manage your inventory efficiently. Navigate through the application using the
                    buttons above to explore the features.
                </p>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: '50px', color: '#888' }}>
                <p>&copy; 2024 Gestion Stock V2. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
