import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Cards from './Cards';
import Sales from './Sales';
import Navbar from '../components/Navbar';
import Inventory from './Inventory';

const Dashboard = () => {
    const [toggle, setToggle] = useState(true); // Sidebar initially open

    const Toggle = () => {
        setToggle(!toggle);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) { // Adjust this value according to your design
                setToggle(false); // Close sidebar when screen size is reduced
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <Cards />
        </>
    );
};

export default Dashboard;
