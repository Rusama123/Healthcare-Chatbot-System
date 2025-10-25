import React from 'react'
import '../Style/supplier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../header-footer/header';
const suppliers = () => {
  return (
    <>
    <Header /> 
    <div className='container-s'>
        <h1>Suppliers</h1>
    </div>

     <div className='container-s  mb-5'>
         <div className='medicane_suppliers Expiring-Items '>
            <div className='row'>

                <div className='col fw-bold'>
                    <p>SUPPLIERS NAME</p>
                </div>
                <div className='col fw-bold'>
                    <p>BATCH NUMBER</p>
                </div>
                <div className='col fw-bold'>
                    <p>QUANTITY</p>
                </div>
                <div className='col fw-bold'>
                    <p>SUPPLIER DATE</p>
                </div>
                <div className='col fw-bold'>
                    <p>DAYS REMAINING</p>
                </div>
                <div className='col fw-bold'>

                </div>
                  <hr></hr>
                
                
            </div>

            <div className='row '>
                <div className='col '>
                    <p>Panadol</p>
                </div>
                <div className='col '>
                    <p>VC-12345</p>
                </div>
                <div className='col '>
                    <p>50 units</p>
                </div>
                <div className='col '>
                    <p>2025-09-30</p>
                </div>
                <div className='col '>
                    <p>45</p>
                </div>
                <div className='col  inventory-actions d-flex gap-3 justify-content-center'>
                      <a href="#"><p className='text-success'>Review</p></a>
                </div>
                <hr></hr>
                
            </div>

            <div className='row '>
                <div className='col '>
                    <p>Panadol</p>
                </div>
                <div className='col '>
                    <p>VC-12345</p>
                </div>
                <div className='col '>
                    <p>50 units</p>
                </div>
                <div className='col '>
                    <p>2025-09-30</p>
                </div>
                <div className='col '>
                    <p>Expired!</p>
                </div>
                <div className='col  inventory-actions d-flex gap-3 justify-content-center'>
                <a href="#"><p className='text-danger'>Review</p></a>
                </div>
                <hr></hr>
                
            </div>

            </div>


       


           
        </div>
    </>
  )
}

export default suppliers