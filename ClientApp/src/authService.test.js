import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { login, deleteProduct } from './authService'; // Assuming login is also in this file

// Mock axios
vi.mock('axios');

describe('authService', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();
    });

    describe('login', () => {
        it('should return user data on successful login', async () => {
            const mockData = { message: 'Login successful', roles: ['Client'], email: 'test@example.com' };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await login('test@example.com', 'password123');

            expect(axios.post).toHaveBeenCalledWith('/api/Account/Login', {
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toEqual(mockData);
        });

        it('should throw an error message on failed login (with response data)', async () => {
            const errorMessage = 'Invalid credentials';
            axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

            await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow(errorMessage);
            expect(axios.post).toHaveBeenCalledWith('/api/Account/Login', {
                email: 'test@example.com',
                password: 'wrongpassword',
            });
        });

        it('should throw a generic error message on failed login (without response data)', async () => {
            axios.post.mockRejectedValue(new Error('Network Error'));

            await expect(login('test@example.com', 'password123')).rejects.toThrow('Login failed');
        });
    });

    describe('deleteProduct', () => {
        it('should make a DELETE request to the correct URL', async () => {
            axios.delete.mockResolvedValue({ data: {} }); // Simulate a successful, empty response
            const productId = 123;

            await deleteProduct(productId);

            expect(axios.delete).toHaveBeenCalledWith(`/api/Product/${productId}`);
        });

        it('should return success object on successful deletion', async () => {
            axios.delete.mockResolvedValue({}); // Simulate successful response
            const productId = 123;

            const result = await deleteProduct(productId);

            expect(result).toEqual({ success: true, message: 'Product deleted successfully.' });
        });

        it('should throw an error message on failed deletion (with response data)', async () => {
            const errorMessage = 'Product not found or access denied';
            axios.delete.mockRejectedValue({ response: { data: { message: errorMessage } } });
            const productId = 404;

            await expect(deleteProduct(productId)).rejects.toThrow(errorMessage);
            expect(axios.delete).toHaveBeenCalledWith(`/api/Product/${productId}`);
        });

        it('should throw a generic error message on failed deletion (without response data)', async () => {
            axios.delete.mockRejectedValue(new Error('Network Error'));
            const productId = 500;

            await expect(deleteProduct(productId)).rejects.toThrow('Failed to delete product.');
        });
    });
});
