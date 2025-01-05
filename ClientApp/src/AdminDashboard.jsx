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

    const styles = {
        container: {
            padding: "20px",
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#f4f4f9",
            minHeight: "100vh",
        },
        header: {
            fontSize: "2rem",
            marginBottom: "20px",
            color: "#333",
            textAlign: "center",
        },
        filterSection: {
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
        },
        input: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
            flex: "1 1 200px",
        },
        select: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
            flex: "1 1 200px",
        },
        button: {
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007BFF",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        addProductForm: {
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        },
        formInput: {
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
        },
        tableHeader: {
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "12px",
            textAlign: "left",
        },
        tableRow: {
            backgroundColor: "#fff",
            borderBottom: "1px solid #ddd",
        },
        tableCell: {
            padding: "12px",
            color: "#333",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Admin Dashboard</h1>

            {/* Filter Section */}
            <div style={styles.filterSection}>
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or reference"
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={styles.input}
                />
                <select
                    name="categoryId"
                    value={filters.categoryId || ""}
                    onChange={handleFilterChange}
                    style={styles.select}
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
                    style={styles.select}
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
                    style={styles.select}
                >
                    <option value="">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={handleFilter}
                >
                    Filter
                </button>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => setShowAddProduct(true)}
                >
                    Add Product
                </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
                <div style={styles.addProductForm}>
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
                            style={styles.formInput}
                        />
                        <input
                            type="text"
                            name="reference"
                            placeholder="Reference"
                            value={newProduct.reference}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                        />
                        <select
                            name="categoryId"
                            value={newProduct.categoryId || ""}
                            onChange={handleInputChange}
                            style={styles.formInput}
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
                            style={styles.formInput}
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
                            style={styles.formInput}
                        />
                        <input
                            type="number"
                            name="currentQuantity"
                            placeholder="Current Quantity"
                            value={newProduct.currentQuantity || ""}
                            onChange={handleInputChange}
                            required
                            style={styles.formInput}
                        />
                        <input
                            type="number"
                            name="minThreshold"
                            placeholder="Min Threshold"
                            value={newProduct.minThreshold || ""}
                            onChange={handleInputChange}
                            style={styles.formInput}
                        />
                        <select
                            name="status"
                            value={newProduct.status}
                            onChange={handleInputChange}
                            style={styles.formInput}
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                        <button
                            type="submit"
                            style={styles.button}
                            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            style={{ ...styles.button, backgroundColor: "#dc3545" }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
                            onClick={() => setShowAddProduct(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Products Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Reference</th>
                        <th style={styles.tableHeader}>Category</th>
                        <th style={styles.tableHeader}>Supplier</th>
                        <th style={styles.tableHeader}>Price</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{product.name}</td>
                            <td style={styles.tableCell}>{product.reference}</td>
                            <td style={styles.tableCell}>{product.categoryNavigation?.name || "N/A"}</td>
                            <td style={styles.tableCell}>{product.supplier?.name || "N/A"}</td>
                            <td style={styles.tableCell}>{product.price}</td>
                            <td style={styles.tableCell}>{product.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;