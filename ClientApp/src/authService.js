import axios from 'axios';

const API_URL = '/api/Account';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/Login`, { email, password });
        return response.data; // { message, roles, email }
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};
