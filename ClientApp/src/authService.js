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

export const deleteProduct = async (productId) => {
    try {
        // Assuming cookies are automatically sent by the browser for authentication
        await axios.delete(`/api/Product/${productId}`);
        return { success: true, message: 'Product deleted successfully.' };
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete product.';
    }
};
