import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // For more realistic user interactions
import AdminDashboard from './AdminDashboard';
import * as authService from './authService'; // To mock deleteProduct
import axios from 'axios'; // To mock API calls for initial data loading

// Mock child components or external dependencies if they are complex and not relevant to the test
// For example, if there were charting libraries or complex modals.

// Mock authService
vi.mock('./authService', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual, // Import and retain other functions from authService
        deleteProduct: vi.fn(), // Mock deleteProduct specifically
    };
});

// Mock axios for data fetching (GetProducts, GetCategories, GetSuppliers)
vi.mock('axios');

// Mock window.confirm and window.alert
global.confirm = vi.fn();
global.alert = vi.fn();


describe('AdminDashboard Component', () => {
    const mockProducts = [
        { id: 1, name: 'Laptop Pro', reference: 'LP001', categoryName: 'Electronics', supplierName: 'TechCorp', price: 1200, status: 'In Stock' },
        { id: 2, name: 'Office Chair', reference: 'OC002', categoryName: 'Furniture', supplierName: 'ComfortInc', price: 150, status: 'In Stock' },
    ];

    const mockCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Furniture' },
    ];

    const mockSuppliers = [
        { id: 1, name: 'TechCorp' },
        { id: 2, name: 'ComfortInc' },
    ];

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();

        // Setup default mock implementations for axios GET calls
        axios.get.mockImplementation((url) => {
            if (url.includes('/api/Product/GetProducts')) {
                return Promise.resolve({ data: mockProducts });
            }
            if (url.includes('/api/Category/GetCategories')) {
                return Promise.resolve({ data: mockCategories });
            }
            if (url.includes('/api/Supplier/GetSuppliers')) {
                return Promise.resolve({ data: mockSuppliers });
            }
            return Promise.reject(new Error(`Unhandled GET request to ${url}`));
        });
        
        // Mock for AddProduct POST call (if interaction leads to it)
        axios.post.mockResolvedValue({ data: { id: 3, name: 'New Product', ...mockProducts[0] } }); // Simplified
    });

    const renderComponent = async () => {
        render(<AdminDashboard />);
        // Wait for initial data to load and table to be populated
        await waitFor(() => {
            expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
            expect(screen.getByText('Office Chair')).toBeInTheDocument();
        });
    };

    it('should render products list with delete buttons', async () => {
        await renderComponent();
        
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
        expect(screen.getByText('Office Chair')).toBeInTheDocument();

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons.length).toBe(mockProducts.length);
    });

    it('should call window.confirm when delete button is clicked', async () => {
        await renderComponent();
        const user = userEvent.setup();

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?');
    });

    it('should call deleteProduct and update UI on successful deletion after confirmation', async () => {
        await renderComponent();
        const user = userEvent.setup();
        
        global.confirm.mockReturnValue(true); // User confirms deletion
        authService.deleteProduct.mockResolvedValue({ success: true }); // Mock successful deletion

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]); // Click delete for "Laptop Pro"

        expect(global.confirm).toHaveBeenCalledTimes(1);
        expect(authService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
        
        // Wait for UI update (product removal)
        await waitFor(() => {
            expect(screen.queryByText('Laptop Pro')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Office Chair')).toBeInTheDocument(); // Ensure other product is still there
        expect(global.alert).toHaveBeenCalledWith('Product deleted successfully.');
    });

    it('should not call deleteProduct if user cancels confirmation', async () => {
        await renderComponent();
        const user = userEvent.setup();

        global.confirm.mockReturnValue(false); // User cancels deletion

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(global.confirm).toHaveBeenCalledTimes(1);
        expect(authService.deleteProduct).not.toHaveBeenCalled();
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument(); // Product should still be in the list
        expect(global.alert).not.toHaveBeenCalled();
    });

    it('should show an error alert if deleteProduct fails', async () => {
        await renderComponent();
        const user = userEvent.setup();

        global.confirm.mockReturnValue(true); // User confirms deletion
        const errorMessage = 'Failed to delete product due to server error';
        authService.deleteProduct.mockRejectedValue(new Error(errorMessage)); // Mock failed deletion

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(global.confirm).toHaveBeenCalledTimes(1);
        expect(authService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
        
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
        });
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument(); // Product should still be in the list if deletion failed
    });
    
    // Example of how you might test the add product form interaction (though not directly part of delete)
    it('should allow typing into the add product form and submitting', async () => {
        await renderComponent();
        const user = userEvent.setup();

        // Open the add product form
        const addProductButton = screen.getByRole('button', { name: /add product/i });
        await user.click(addProductButton);

        // Check if form is visible (e.g., by a form field)
        const nameInput = screen.getByPlaceholderText('Name');
        expect(nameInput).toBeInTheDocument();

        await user.type(nameInput, 'New Awesome Gadget');
        expect(nameInput).toHaveValue('New Awesome Gadget');
        
        // Simulate filling other required fields...
        await user.type(screen.getByPlaceholderText('Reference'), 'NAG001');
        await user.type(screen.getByPlaceholderText('Price'), '99.99');
        await user.type(screen.getByPlaceholderText('Current Quantity'), '10');

        // Mock AddProduct API call if not already done broadly
        axios.post.mockResolvedValueOnce({ 
            data: { 
                id: 3, name: 'New Awesome Gadget', reference: 'NAG001', price: 99.99, currentQuantity: 10, status: 'In Stock', 
                categoryName: 'Electronics', // Ensure response matches what table expects
                supplierName: 'TechCorp' 
            } 
        });

        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);
        
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/Product/AddProduct", expect.objectContaining({
                name: 'New Awesome Gadget',
                reference: 'NAG001'
            }));
        });
        
        // Check if the new product appears in the table
        // Note: The product list in the test uses mockProducts. After adding, it would be part of response.data.
        // The fetchProducts() isn't automatically recalled in this test after add, so the new product might not show
        // unless explicitly handled by adding to the products state in the component, which it does.
        await waitFor(() => {
            expect(screen.getByText('New Awesome Gadget')).toBeInTheDocument();
        });
    });
});
