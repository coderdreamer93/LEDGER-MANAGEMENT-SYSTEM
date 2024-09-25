import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import AreaChart from './AreaChart';

const Donut = () => {
    const [salesData, setSalesData] = useState([]);
    const [inventoriesData, setInventoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sales data
                const salesResponse = await axios.get('http://localhost:8080/api/v1/sales/sales');
                setSalesData(salesResponse.data);

                // Fetch inventories data
                const inventoriesResponse = await axios.get('http://localhost:8080/api/v1/inventories/inventories');
                setInventoriesData(inventoriesResponse.data);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalSales = salesData.length;
    const totalInventories = inventoriesData.length;

    const options = {
        chart: {
            type: 'pie',
        },
        labels: ['Total Sales', 'Total Inventories'],
        series: [totalSales, totalInventories],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <>

            <div style={{ marginLeft: '120%', marginTop: '15%' }}>
                <Chart options={options} series={options.series} type="pie" width={500} />
            </div>

        </>



    );
};

export default Donut;
