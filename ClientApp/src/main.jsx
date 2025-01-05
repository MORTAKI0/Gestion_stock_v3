import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles as a JavaScript object (optional)
const globalStyles = {
    body: {
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f4f4f9',
        color: '#333',
    },
    h1: {
        color: '#007BFF',
    },
    p: {
        color: '#666',
        lineHeight: '1.6',
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
    'button:hover': {
        opacity: '0.9',
        transform: 'translateY(-2px)',
    },
};

// Apply global styles dynamically
Object.entries(globalStyles).forEach(([selector, styles]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        Object.assign(element.style, styles);
    });
});

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);