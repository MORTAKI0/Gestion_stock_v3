import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = (action) => {
        if (action === 'Login') navigate('/login');
        if (action === 'Register') navigate('/register');
        if (action === 'Manage Products') navigate('/manage-products');
        if (action === 'View Reports') navigate('/view-reports');
        if (action === 'Settings') navigate('/settings');
    };

    return (
        <div style={styles.homeContainer}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.logo}>Gestion Stock V3</div>
                <div style={styles.navLinks}>
                    <button style={styles.navButton} onClick={() => handleButtonClick('Login')}>
                        Login
                    </button>
                    <button style={styles.navButton} onClick={() => handleButtonClick('Register')}>
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={styles.heroSection}>
                <h1 style={styles.heroTitle}>Get More Done with Gestion Stock V3</h1>
                <p style={styles.heroSubtitle}>
                    Project engagement confirms the analysis your teams can obtain, and manage your inventory efficiently.
                </p>
                <div style={styles.heroButtons}>
                    <button style={{ ...styles.button, ...styles.primaryButton }} onClick={() => handleButtonClick('Manage Products')}>
                        Manage Products
                    </button>
                    <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => handleButtonClick('View Reports')}>
                        View Reports
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section style={styles.featuresSection}>
                <h2 style={styles.sectionTitle}>Work Together</h2>
                <p style={styles.sectionSubtitle}>
                    Collaborate with your team to manage your inventory and streamline your workflow.
                </p>
                <div style={styles.featureCards}>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>Instant</h3>
                        <p style={styles.featureDescription}>
                            Access real-time updates and manage your inventory instantly.
                        </p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>Sustained</h3>
                        <p style={styles.featureDescription}>
                            Ensure sustained growth with efficient stock management.
                        </p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>Numerant</h3>
                        <p style={styles.featureDescription}>
                            Track and analyze your inventory with advanced reporting tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>&copy; 2024 Gestion Stock V3. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;

// Inline Styles
const styles = {
    homeContainer: {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f4f4f9',
        color: '#333',
        minHeight: '100vh',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#007BFF',
        color: '#FFF',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        gap: '15px',
    },
    navButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#FFF',
        color: '#007BFF',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    heroSection: {
        textAlign: 'center',
        padding: '100px 20px',
        backgroundColor: '#007BFF',
        color: '#FFF',
    },
    heroTitle: {
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    heroSubtitle: {
        fontSize: '1.2rem',
        marginBottom: '40px',
    },
    heroButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    button: {
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    primaryButton: {
        backgroundColor: '#FFF',
        color: '#007BFF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        border: '2px solid #FFF',
        color: '#FFF',
    },
    featuresSection: {
        padding: '80px 20px',
        textAlign: 'center',
        backgroundColor: '#FFF',
        color: '#333',
    },
    sectionTitle: {
        fontSize: '2rem',
        marginBottom: '20px',
    },
    sectionSubtitle: {
        fontSize: '1.1rem',
        marginBottom: '40px',
    },
    featureCards: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
    },
    featureCard: {
        flex: '1 1 300px',
        maxWidth: '300px',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    featureTitle: {
        fontSize: '1.5rem',
        marginBottom: '10px',
    },
    featureDescription: {
        fontSize: '1rem',
        color: '#666',
    },
    footer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#007BFF',
        color: '#FFF',
    },
};