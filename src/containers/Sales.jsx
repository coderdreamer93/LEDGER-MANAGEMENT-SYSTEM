import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        productName: '',
        totalLetre: '',
        weight: '',
        unitPrice: '',
        totalPrice: '',
        customerName: '',
        saleDate: new Date().toISOString().slice(0, 10)
    });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/sales/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            id: '',
            productName: '',
            totalLetre: '',
            weight: '',
            unitPrice: '',
            totalPrice: '',
            customerName: '',
            saleDate: new Date().toISOString().slice(0, 10)
        });
        fetchSales();
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
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/v1/sales/sales/${currentItemId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/v1/sales/sales', formData);
            }
            fetchSales();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving sale:', error);
        }
    };

    const handleEdit = (sale) => {
        setIsEditMode(true);
        setFormData({
            id: sale.id,
            productName: sale.productName,
            totalLetre: sale.totalLetre,
            weight: sale.weight,
            unitPrice: sale.unitPrice,
            totalPrice: sale.totalPrice,
            customerName: sale.customerName,
            saleDate: new Date(sale.saleDate).toISOString().slice(0, 10)
        });
        setCurrentItemId(sale._id);
        setIsEdit(true);
        handleOpenModal();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/sales/sales/${id}`);
            fetchSales();
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredSale = sales.filter(sale =>
        sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="main-content container-fluid px-4">
                <div className="row mt-4">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Sales</h2>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{ width: '300px', marginRight: '10px' }}
                                />
                                <Button variant="info border-rounded" onClick={handleOpenModal}>Add Sales</Button>
                            </div>
                        </div>
                        {filteredSale.length === 0 ? (
                            <p>No sales found.</p>
                        ) : (
                            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                <table className="table table-hover table-bordered text-center">
                                    <thead className='table-info'>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Customer Name</th>
                                            <th>Product Name</th>
                                            <th>Weight</th>
                                            <th>Total Litre</th>
                                            <th>Unit Price</th>
                                            <th>Total Price</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSale.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{sale.customerName}</td>
                                                <td>{sale.productName}</td>
                                                <td>{sale.weight}</td>
                                                <td>{sale.totalLetre}</td>
                                                <td>{sale.unitPrice}</td>
                                                <td>{sale.totalPrice}</td>
                                                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="light" className='btn-sm' onClick={() => handleEdit(sale)}>
                                                        <BsPencilSquare />
                                                    </Button>
                                                    <Button variant="light" className='btn-sm' onClick={() => handleDelete(sale._id)}>
                                                        <BsTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                {/* <Button variant="info border-rounded" onClick={handleOpenModal}>
                    Add Sale
                </Button> */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? 'Edit Sale' : 'Add New Sale'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="customerName">
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Control type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="productName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="weight">
                                <Form.Label>Weight</Form.Label>
                                <Form.Control type="text" name="weight" value={formData.weight} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="totalLetre">
                                <Form.Label>Total Litre</Form.Label>
                                <Form.Control type="number" name="totalLetre" value={formData.totalLetre} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="unitPrice">
                                <Form.Label>Unit Price</Form.Label>
                                <Form.Control type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="totalPrice">
                                <Form.Label>Total Price</Form.Label>
                                <Form.Control type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="info" onClick={handleSubmit}>
                            {isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Sales;
