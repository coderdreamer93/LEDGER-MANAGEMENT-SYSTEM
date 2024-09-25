import React from 'react';
import Sidebar from './components/Sidebar';
import { UserButton } from "@clerk/clerk-react";

const ProtectedPage = () => {
    return (
        <div className="protected-page">
            <Sidebar />
            <div className="page-content">
                <UserButton />
            </div>
        </div>
    );
};

export default ProtectedPage;
