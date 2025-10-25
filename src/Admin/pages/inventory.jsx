import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/inventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import icon from "../../assets/btn_icon.svg";
import Header from '../header-footer/header';
import AddDrugModal from './AddDrugModal';
import EditDrugModal from './EditDrugModal';
import ViewDrugModal from './ViewDrugModal';
import BarcodeScanner from './BarcodeScanner';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcodeScanMode, setBarcodeScanMode] = useState('sell');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = { 
        page: currentPage, 
        limit: 20 
      };
      
      if (search) params.search = search;
      if (category && category !== 'All Categories') params.category = category;

      const res = await axios.get('http://localhost:5000/api/inventory', { params });
      
      setInventory(res.data.inventory || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      alert('Error fetching inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, category, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const openBarcodeSell = () => {
    setBarcodeScanMode('sell');
    setShowBarcodeScanner(true);
  };

  const openBarcodeAdd = () => {
    setBarcodeScanMode('add');
    setShowBarcodeScanner(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${id}`);
       
        fetchInventory();
      } catch (err) {
        console.error(err);
        alert('Error deleting item');
      }
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/inventory/${id}`);
      setSelectedItem(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      alert('Error fetching item details');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/inventory/${id}`);
      setSelectedItem(res.data);
      setShowEditModal(true);
    } catch (err) {
      console.error(err);
      alert('Error fetching item details');
    }
  };

  return (
    <>
      <Header />
      <div className='container-i d-flex justify-content-between align-items-center py-4'>
        <h1>Inventory Management</h1>
        <div className='d-flex gap-2'>
          <button 
            type='button' 
            className='inventory_btn'
            onClick={openBarcodeSell}
          >
            🛒 Scan to Sell
          </button>
          <button 
            type='button' 
            className='inventory_btn'
            onClick={openBarcodeAdd}
          >
            📦 Scan to Add Stock
          </button>
          <button 
            type='button' 
            className='inventory_btn'
            onClick={() => setShowAddModal(true)}
          >
            Add New Drug
          </button>
        </div>
      </div>

      <div className='container-i'>
        <div className='search d-flex align-items-center'>
          <div className='input_search'>
            <input 
              type="text" 
              placeholder='Search by Brand Name or Generic Name . . .' 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className='d-flex align-items-center gap-3'>
            <select 
              className='Categories-btn'
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='container-i table-container mb-5'>
        <div className='medicane_data'>
          <div className='row'>
            <div className='col fw-bold'><p>BRAND NAME</p></div>
            <div className='col fw-bold'><p>GENERIC NAME</p></div>
            <div className='col fw-bold'><p>DOSAGE</p></div>
            <div className='col fw-bold'><p>CATEGORY</p></div>
            <div className='col fw-bold'><p>UNIT PRICE</p></div>
            <div className='col fw-bold'><p>BOX PRICE</p></div>
            <div className='col fw-bold'><p>CURRENT STOCK</p></div>
            <div className='col fw-bold'></div>
            <hr />
          </div>

          {loading ? (
            <div className='text-center py-4'>
              <p>Loading...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className='text-center py-4'>
              <p>No inventory items found</p>
            </div>
          ) : (
            inventory.map((item) => (
              <div key={item._id}>
                <div className='row'>
                  <div className='col'><p>{item.brandName || 'N/A'}</p></div>
                  <div className='col'><p>{item.genericName || 'N/A'}</p></div>
                  <div className='col'><p>{item.dosage || 'N/A'}</p></div>
                  <div className='col'><p>{item.category || 'N/A'}</p></div>
                  <div className='col'><p>${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</p></div>
                  <div className='col'><p>${item.boxPrice ? item.boxPrice.toFixed(2) : '0.00'}</p></div>
                  <div className='col'><p>{item.currentStock || 0} units</p></div>
                  <div className='col inventory-actions d-flex gap-3'>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleView(item._id); }}>
                      <p className='text-success'>View</p>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(item._id); }}>
                      <p className='text-warning'>Edit</p>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleDelete(item._id); }}>
                      <p className='text-danger'>Delete</p>
                    </a>
                  </div>
                </div>
                <hr />
              </div>
            ))
          )}

          <div className='row gap-3 align-items-center pt-3'>
            <div className='col'>
              <p>Showing {inventory.length > 0 ? ((currentPage - 1) * 20) + 1 : 0} to {Math.min(currentPage * 20, total)} of {total} results</p>
            </div>
            <div className='col d-flex justify-content-end gap-3'>
              <button 
                type='button' 
                className='Categories-btn px-5'
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                type='button' 
                className='Categories-btn px-5'
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddDrugModal
          show={showAddModal} 
          onHide={() => setShowAddModal(false)} 
          onSuccess={fetchInventory}
        />
      )}

      {showEditModal && selectedItem && (
        <EditDrugModal
          show={showEditModal} 
          onHide={() => setShowEditModal(false)} 
          item={selectedItem}
          onSuccess={fetchInventory}
        />
      )}

      {showViewModal && selectedItem && (
        <ViewDrugModal 
          show={showViewModal} 
          onHide={() => setShowViewModal(false)} 
          item={selectedItem}
        />
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          show={showBarcodeScanner}
          onHide={() => setShowBarcodeScanner(false)}
          onSuccess={fetchInventory}
          mode={barcodeScanMode}
        />
      )}
    </>
  );
};

export default Inventory;