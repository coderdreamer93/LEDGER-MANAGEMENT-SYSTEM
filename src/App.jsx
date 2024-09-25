import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './containers/Dashboard';
import Customer from './containers/Customer';
import Sales from './containers/Sales';
import Inventory from './containers/Inventory';
import { UserProvider } from './containers/UserContext';
import Login from './containers/Login';
import Register from './containers/Register';
import ProtectedRoute from './PrivateRoute';
import { AuthProvider } from './containers/AuthContext';
import Purchase from './containers/Purchase';
import Supplier from './containers/Supplier';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [toggle, setToggle] = useState(true);

  const Toggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <MainContent toggle={toggle} Toggle={Toggle} />
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

const MainContent = ({ toggle, Toggle }) => {
  const location = useLocation();
  const hideSidebarAndNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="container-fluid">
      <div className="row">
        {!hideSidebarAndNavbar && toggle && (
          <div className="col-2 vh-100">
            <Sidebar />
          </div>
        )}
        <div className={toggle && !hideSidebarAndNavbar ? 'col-10' : 'col-12'}>
          {!hideSidebarAndNavbar && <Navbar Toggle={Toggle} />}
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventories" element={<Inventory />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/products" element={<Supplier />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
