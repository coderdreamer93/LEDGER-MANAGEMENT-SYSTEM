import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';

const Inventory = ({ Toggle }) => {
    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        accountNo: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        inventoryDate: new Date().toISOString().slice(0, 10)
    });
    const [productNames, setProductNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totals, setTotals] = useState({
        totalTransaction: 0,
        totalDebit: 0,
        totalCurrentBalance: 0
    });

    useEffect(() => {
        const totalTransaction = inventory.reduce((total, item) => total + parseFloat(item.category), 0);
        const totalDebit = inventory.reduce((total, item) => total + parseFloat(item.quantity), 0);
        const totalCurrentBalance = inventory.reduce((total, item) => total + parseFloat(item.price), 0);
        setTotals({
            totalTransaction,
            totalDebit,
            totalCurrentBalance
        });
    }, [inventory]);

    useEffect(() => {
        fetchInventory();
        fetchProductNames();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/inventories/inventories');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchProductNames = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/sales/sales');
            const customerName = response.data.map(sale => sale.customerName);
            setProductNames([...new Set(customerName)]); // Remove duplicates
        } catch (error) {
            console.error('Error fetching product names:', error);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setCurrentItemId(null);
        // Clear form data
        setFormData({
            customerName: '',
            accountNo: '',
            category: '',
            quantity: '',
            price: '',
            description: '',
            inventoryDate: new Date().toISOString().slice(0, 10)
        });
        fetchInventory();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8080/api/v1/inventories/inventories/${currentItemId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/v1/inventories/inventories', formData);
            }
            fetchInventory();
            setShowModal(false); // Close modal after successful submission
            setFormData({  // Clear form data after successful submission
                customerName: '',
                accountNo: '',
                category: '',
                quantity: '',
                price: '',
                description: '',
                inventoryDate: new Date().toISOString().slice(0, 10)
            });
        } catch (error) {
            console.error('Error adding/updating item to inventory:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEdit = (item) => {
        setFormData({
            customerName: item.customerName,
            accountNo: item.accountNo,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            inventoryDate: new Date(item.inventoryDate).toISOString().slice(0, 10)
        });
        setCurrentItemId(item._id);
        setIsEdit(true);
        handleOpenModal();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/inventories/inventories/${id}`);
            fetchInventory();
        } catch (error) {
            console.error('Error deleting item from inventory:', error);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="main-content container-fluid px-4">
                <div className="row mt-4">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Accounts</h2>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{ width: '300px', marginRight: '10px' }}
                                />
                                <Button variant="info border-rounded" onClick={handleOpenModal}>Add Item</Button>
                            </div>
                        </div>
                        {filteredInventory.length === 0 ? (
                            <p>No account found.</p>
                        ) : (
                            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                <table className="table table-hover table-bordered text-center">
                                    <thead className='table-info'>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Customer Name</th>
                                            <th>Account No</th>
                                            <th>Transaction</th>
                                            <th>Debit</th>
                                            <th>Current Balance</th>
                                            <th>Date</th>
                                            <th>Details</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInventory.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.customerName}</td>
                                                <td>{item.accountNo}</td>
                                                <td>{item.category}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price}</td>
                                                <td>{new Date(item.inventoryDate).toLocaleDateString()}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <Button variant="light" className='btn-sm' onClick={() => handleEdit(item)}>
                                                        <BsPencilSquare />
                                                    </Button>
                                                    <Button variant="light" className='btn-sm' onClick={() => handleDelete(item._id)}>
                                                        <BsTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>-</td>
                                            <td colSpan="2">Total Debit:</td>
                                            
                                            <td>{totals.totalTransaction}</td>
                                            <td>{totals.totalDebit}</td>
                                            <td>{totals.totalCurrentBalance}</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
                {/* Modal for adding new item */}
                <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-dialog-scrollable">
                    <Modal.Header closeButton>
                        <Modal.Title>{isEdit ? 'Edit Item' : 'Add New Item'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="customerName">
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Control as="select" name="customerName" value={formData.customerName} onChange={handleChange}>
                                    <option value="">Select Customer Name</option>
                                    {productNames.map((customerName, index) => (
                                        <option key={index} value={customerName}>{customerName}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="accountNo">
                                <Form.Label>Account No</Form.Label>
                                <Form.Control type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="category">
                                <Form.Label>Transaction</Form.Label>
                                <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="quantity">
                                <Form.Label>Debit</Form.Label>
                                <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Current Balance</Form.Label>
                                <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Details</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="info" onClick={handleSubmit}>
                            {isEdit ? 'Update' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Inventory;
