import React from 'react'
import Sidebar from '../components/Sidebar'
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';



const Customer = () => {
  return (
<>
    <Sidebar />
           <table className="table table-hover table-bordered">
                <thead className='table-dark'>
                    <tr>
                        <th className='text-center'>Name</th>
                        <th className='text-center'>Contact Number</th>
                        <th className='text-center'>Email</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                        <tr className='text-center'>
                            <td className='text-center'>{}</td>
                            <td className='text-center'>{}</td>
                            <td className='text-center'>{}</td>
                            <td className='text-center'>
                                <Button variant="light" className='btn-sm' >
                                    <BsPencilSquare />
                                </Button>
                                <Button
                                    variant="light" className='btn-sm'
                                    >
                                    <BsTrash />
                                </Button>
                            </td>
                        </tr>
                </tbody>
            </table> 
    
</>
    )
}

export default Customer
