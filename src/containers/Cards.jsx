import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Donut from './Donut';
import AreaChart from './AreaChart';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Card = ({ Toggle }) => {
    const [counts, setCounts] = useState({ sales: 0, purchases: 0, products: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [inventoriesData, setInventoriesData] = useState([]);

    const fetchData = async () => {
        try {
            const salesResponse = await axios.get('http://localhost:8080/api/v1/sales/sales');
            setSalesData(salesResponse.data);

            const inventoriesResponse = await axios.get('http://localhost:8080/api/v1/inventories/inventories');
            setInventoriesData(inventoriesResponse.data);
            const purchasesResponse = await axios.get('http://localhost:8080/api/v1/purchase/purchases');
            setInventoriesData(inventoriesResponse.data);


            const salesCount = salesResponse.data.length;
            const purchasesCount = purchasesResponse.data.length;
            const inventoriesCount = inventoriesResponse.data.length;

            setCounts({ sales: salesCount, inventories: inventoriesCount, purchases: purchasesCount });
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="px-2">
                <div className="container-fluid">
                    <div className="row g-1 my-2">
                        {/* <div className="col-md-3">
                            <div className="p-3 bg-green d-flex justify-content-around align-items-center shadow-sm rounded" style={{ backgroundColor: '#28a745' }}>
                                <h3 className='fs-0' style={{ color: 'white' }}>{counts.purchases}</h3>
                                <div>
                                    <h3 className='fs-5' style={{ color: 'white' }}>Products</h3>
                                </div>
                                <i className="bi bi-cash-coin p-3 fs-1" style={{ color: 'white' }}></i>
                            </div>
                        </div> */}
                        <div className="col-md-4">
                            <div className="p-3 bg-orange shadow-sm d-flex justify-content-around align-items-center rounded" style={{ backgroundColor: '#8fc7cc' }}>
                                <h3 className='fs-2' style={{ color: 'white' }}>{counts.sales}</h3>
                                <div>
                                    <h3 className='fs-5' style={{ color: 'white' }}>Sales</h3>
                                </div>
                                <i className="bi bi-currency-dollar p-3 fs-1" style={{ color: 'white' }}></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 bg-pink shadow-sm d-flex justify-content-around align-items-center rounded" style={{ backgroundColor: '#eb7a34' }}>
                                <h3 className='fs-2' style={{ color: 'white' }}>{counts.inventories}</h3>
                                <div>
                                    <h3 className='fs-5' style={{ color: 'white' }}>Accounts</h3>
                                </div>
                                <i className="bi bi-truck p-3 fs-1" style={{ color: 'white' }}></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 bg-pink shadow-sm d-flex justify-content-around align-items-center rounded" style={{ backgroundColor: '#8dbceb' }}>
                                <h3 className='fs-2' style={{ color: 'white' }}>{counts.purchases}</h3>
                                <div>
                                    <h3 className='fs-5' style={{ color: 'white' }}>Purchase</h3>
                                </div>
                                <i className="bi bi-truck p-3 fs-1" style={{ color: 'white' }}></i>
                            </div>
                        </div>
                        {/* <div className="col-md-3">
                            <AreaChart />
                        </div>
                        <div className="col-md-3">
                            <Donut />
                        </div> */}

                    </div>
                </div>
            </div>
        </>
    );
};




export default Card;
