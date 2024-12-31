import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        categoryId: "",
        supplierId: "",
        status: "",
    });

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        reference: "",
        categoryId: "",
        supplierId: "",
        price: "",
        currentQuantity: "",
        minThreshold: "",
        status: "In Stock",
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/api/Product/GetProducts", {
                params: filters,
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/Category/GetCategories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("/api/Supplier/GetSuppliers");
            setSuppliers(response.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error.response?.data || error.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleFilter = () => {
        const nonEmptyFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== "")
        );
        console.log("Filters being applied:", nonEmptyFilters);
        fetchProducts();
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.reference || !newProduct.price || !newProduct.currentQuantity) {
            alert("Please fill out all required fields.");
            return;
        }

        const payload = {
            name: newProduct.name,
            reference: newProduct.reference,
            categoryId: newProduct.categoryId || null,
            supplierId: newProduct.supplierId || null,
            currentQuantity: parseInt(newProduct.currentQuantity, 10) || 0,
            minThreshold: parseInt(newProduct.minThreshold, 10) || 0,
            price: parseFloat(newProduct.price),
            status: newProduct.status,
        };

        console.log("Payload being sent:", payload);

        try {
            const response = await axios.post("/api/Product/AddProduct", payload);
            console.log("Product added successfully:", response.data);
            setProducts((prevProducts) => [...prevProducts, response.data]);
            setNewProduct({
                name: "",
                reference: "",
                categoryId: "",
                supplierId: "",
                price: "",
                currentQuantity: "",
                minThreshold: "",
                status: "In Stock",
            });
            setShowAddProduct(false);
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            alert("Failed to add product. Please check your input.");
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or reference"
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <select
                    name="categoryId"
                    value={filters.categoryId || ""}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="supplierId"
                    value={filters.supplierId || ""}
                    onChange={handleFilterChange}
                >
                    <option value="">All Suppliers</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
                <select
                    name="status"
                    value={filters.status || ""}
                    onChange={handleFilterChange}
                >
                    <option value="">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
                <button onClick={handleFilter}>Filter</button>
                <button onClick={() => setShowAddProduct(true)}>Add Product</button>
            </div>

            {showAddProduct && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Add Product</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddProduct();
                        }}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="reference"
                            placeholder="Reference"
                            value={newProduct.reference}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="categoryId"
                            value={newProduct.categoryId || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="supplierId"
                            value={newProduct.supplierId || ""}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newProduct.price || ""}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="currentQuantity"
                            placeholder="Current Quantity"
                            value={newProduct.currentQuantity || ""}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="minThreshold"
                            placeholder="Min Threshold"
                            value={newProduct.minThreshold || ""}
                            onChange={handleInputChange}
                        />
                        <select
                            name="status"
                            value={newProduct.status}
                            onChange={handleInputChange}
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setShowAddProduct(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reference</th>
                        <th>Category</th>
                        <th>Supplier</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.reference}</td>
                            <td>{product.categoryNavigation?.name || "N/A"}</td>
                            <td>{product.supplier?.name || "N/A"}</td>
                            <td>{product.price}</td>
                            <td>{product.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
