import React from 'react';
import Chart from 'react-apexcharts';

const StackedChart = () => {
    // Sample data for the chart
    const salesData = [44, 55, 41, 67, 22, 43];
    const inventoriesData = [13, 23, 20, 8, 13, 27];

    // Calculate total length of sales and inventories
    const totalSales = salesData.reduce((acc, curr) => acc + curr, 0);
    const totalInventories = inventoriesData.reduce((acc, curr) => acc + curr, 0);

    const series = [{
        name: 'Total Iventories',
        data: salesData
    }, {
        name: 'Total Sales',
        data: inventoriesData
    }];

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        colors: ['#008FFB', '#00E396'],
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        annotations: {
            xaxis: [
                {
                    x: 'Jan',
                    borderColor: '#FF4560',
                    label: {
                        borderColor: '#FF4560',
                        style: {
                            color: '#fff',
                            background: '#FF4560'
                        },
                        text: 'Total Sales: ' + totalSales,
                    }
                },
                {
                    x: 'Jun',
                    borderColor: '#FEB019',
                    label: {
                        borderColor: '#FEB019',
                        style: {
                            color: '#fff',
                            background: '#FEB019'
                        },
                        text: 'Total Inventories: ' + totalInventories,
                    }
                }
            ]
        }
    };

    return (
        <div style={{ marginTop: '10%' }}>
            <Chart options={options} series={series} type="bar" height={350} width={450} />
        </div>
    );
};

export default StackedChart;
