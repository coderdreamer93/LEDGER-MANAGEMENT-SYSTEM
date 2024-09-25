import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        productName: '',
        totalNoLetre: '',
        weight: '',
        unitPrice: '',
        totalPrice: '',
        customerName: '',
        saleDate: new Date().toISOString().slice(0, 10)
    });

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/purchase/purchases');
            setPurchases(response.data);
        } catch (error) {
            console.error('Error fetching purchases:', error);
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
            totalNoLetre: '',
            weight: '',
            unitPrice: '',
            totalPrice: '',
            customerName: '',
            saleDate: new Date().toISOString().slice(0, 10)
        });
        fetchPurchases();
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
                await axios.put(`http://localhost:8080/api/v1/purchase/purchases/${currentItemId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/v1/purchase/purchases', formData);
            }
            fetchPurchases();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving purchase:', error);
        }
    };
    const [isEdit, setIsEdit] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const handleEdit = (purchase) => {
        setIsEditMode(true);
        setFormData({
            id: purchase.id,
            productName: purchase.productName,
            totalNoLetre: purchase.totalNoLetre,
            weight: purchase.weight,
            unitPrice: purchase.unitPrice,
            totalPrice: purchase.totalPrice,
            customerName: purchase.customerName,
            saleDate: new Date(purchase.saleDate).toISOString().slice(0, 10)
        });
        setCurrentItemId(purchase._id);
        setIsEdit(true);
        handleOpenModal();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/purchase/purchases/${id}`);
            fetchPurchases();
        } catch (error) {
            console.error('Error deleting purchase:', error);
        }
    };


    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPurchase = purchases.filter(purchase =>
        purchase.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className='main-content container-fluid px-4'>
                <div className="row mt-4">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Purchase</h2>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{ width: '300px', marginRight: '10px' }}
                                />
                                <Button variant="info border-rounded" onClick={handleOpenModal}>Add Purchase</Button>
                            </div>
                        </div>
                        {filteredPurchase.length === 0 ? (
                            <p>No purchases found.</p>
                        ) : (
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
                                    {filteredPurchase.map((purchase, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{purchase.customerName}</td>
                                            <td>{purchase.productName}</td>
                                            <td>{purchase.weight}</td>
                                            <td>{purchase.totalNoLetre}</td>
                                            <td>{purchase.unitPrice}</td>
                                            <td>{purchase.totalPrice}</td>
                                            <td>{new Date(purchase.saleDate).toLocaleDateString()}</td>
                                            <td>
                                                <Button variant="light" className='btn-sm' onClick={() => handleEdit(purchase)}>
                                                    <BsPencilSquare />
                                                </Button>
                                                <Button variant="light" className='btn-sm' onClick={() => handleDelete(purchase._id)}>
                                                    <BsTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {/* <Button variant="info border-rounded" onClick={handleOpenModal}>
                    Add Purchase
                </Button> */}
                <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-dialog-scrollable">
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? 'Edit Purchase' : 'Add New Purchase'}</Modal.Title>
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
                            <Form.Group controlId="totalNoLetre">
                                <Form.Label>Total Litre</Form.Label>
                                <Form.Control type="number" name="totalNoLetre" value={formData.totalNoLetre} onChange={handleChange} />
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
                            {isEditMode ? 'Save Changes' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Purchase;
