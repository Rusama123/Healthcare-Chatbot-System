import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../header-footer/header';

const Alerts = () => {
  const [expiringItems, setExpiringItems] = useState([]);
  const [reorderItems, setReorderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/alerts');
      setExpiringItems(res.data.expiringItems || []);
      setReorderItems(res.data.reorderItems || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      alert('Error fetching alerts');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAlertLevel = (daysRemaining) => {
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 3) return 'high';
    if (daysRemaining <= 7) return 'medium';
    if (daysRemaining <= 15) return 'low';
    return 'normal';
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <>
      <Header />
      <div className='container-a py-4'>
        <h1>Alerts & Suggestions</h1>
      </div>
     
      <div className='container-a'>
        <div className='row alert-container'>
          <div className='col'>
            <h2
              className='fs-2 h-expiry'
              onClick={() => {
                document.querySelector(".Expiring-Items").style.display = "block";
                document.querySelector(".Reorder-Suggestion").style.display = "none";
              }}
              style={{ cursor: "pointer" }}
            >
              Expiring Items ({expiringItems.length})
            </h2>
          </div>
          <div className='col'>
            <h2
              className='fs-2 h-expiry'
              onClick={() => {
                document.querySelector(".Expiring-Items").style.display = "none";
                document.querySelector(".Reorder-Suggestion").style.display = "block";
              }}
              style={{ cursor: "pointer" }}
            >
              Reorder Suggestion ({reorderItems.length})
            </h2>
          </div>
        </div>
      </div>
    
      <div className='container-a mb-5'>
        {/* Expiring Items Section */}
        <div className='medicane_expiry Expiring-Items'>
          <div className='row'>
            <div className='col fw-bold'><p>BRAND NAME</p></div>
            <div className='col fw-bold'><p>BATCH NUMBER</p></div>
            <div className='col fw-bold'><p>QUANTITY</p></div>
            <div className='col fw-bold'><p>EXPIRY DATE</p></div>
            <div className='col fw-bold'><p>DAYS REMAINING</p></div>
            <div className='col fw-bold'></div>
            <hr />
          </div>

          {loading ? (
            <div className='text-center py-4'>
              <p>Loading alerts...</p>
            </div>
          ) : expiringItems.length === 0 ? (
            <div className='text-center py-4'>
              <p>No expiring items found</p>
            </div>
          ) : (
            expiringItems.map((item, index) => {
              const daysRemaining = getDaysRemaining(item.expiryDate);
              const alertLevel = getAlertLevel(daysRemaining);
              const isExpired = daysRemaining < 0;

              return (
                <div key={index}>
                  <div className='row'>
                    <div className='col'>
                      <p>{item.brandName}</p>
                    </div>
                    <div className='col'>
                      <p>{item.batchNumber}</p>
                    </div>
                    <div className='col'>
                      <p>{item.quantity} units</p>
                    </div>
                    <div className='col'>
                      <p>{formatDate(item.expiryDate)}</p>
                    </div>
                    <div className='col'>
                      <p style={{ 
                        color: isExpired ? '#dc3545' : 
                               daysRemaining <= 1 ? '#dc3545' : 
                               daysRemaining <= 3 ? '#fd7e14' : 
                               daysRemaining <= 7 ? '#ffc107' : '#198754',
                        fontWeight: 'bold'
                      }}>
                        {isExpired ? 'Expired!' : `${daysRemaining} days`}
                      </p>
                    </div>
                    <div className='col inventory-actions d-flex gap-3 justify-content-center'>
                      <a href="#">
                        <p className={isExpired ? 'text-danger' : 'text-warning'}>
                          {isExpired ? 'Replace' : 'Review'}
                        </p>
                      </a>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })
          )}
        </div>

        {/* Reorder Suggestion Section */}
        <div className='medicane_expiry Reorder-Suggestion'>
          <div className='row'>
            <div className='col fw-bold'><p>BRAND NAME</p></div>
            <div className='col fw-bold'><p>GENERIC NAME</p></div>
            <div className='col fw-bold'><p>CURRENT STOCK</p></div>
            <div className='col fw-bold'><p>CATEGORY</p></div>
            <div className='col fw-bold'><p>STATUS</p></div>
            <div className='col fw-bold'></div>
            <hr />
          </div>

          {loading ? (
            <div className='text-center py-4'>
              <p>Loading reorder suggestions...</p>
            </div>
          ) : reorderItems.length === 0 ? (
            <div className='text-center py-4'>
              <p>No items need reordering</p>
            </div>
          ) : (
            reorderItems.map((item, index) => (
              <div key={index}>
                <div className='row'>
                  <div className='col'>
                    <p>{item.brandName}</p>
                  </div>
                  <div className='col'>
                    <p>{item.genericName}</p>
                  </div>
                  <div className='col'>
                    <p style={{ 
                      color: item.currentStock === 0 ? '#dc3545' : 
                             item.currentStock <= 5 ? '#fd7e14' : '#ffc107',
                      fontWeight: 'bold'
                    }}>
                      {item.currentStock} units
                    </p>
                  </div>
                  <div className='col'>
                    <p>{item.category}</p>
                  </div>
                  <div className='col'>
                    <p style={{ 
                      color: item.currentStock === 0 ? '#dc3545' : 
                             item.currentStock <= 5 ? '#fd7e14' : '#ffc107',
                      fontWeight: 'bold'
                    }}>
                      {item.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </p>
                  </div>
                  <div className='col inventory-actions d-flex gap-3 justify-content-center'>
                    <a href="#">
                      <p className='text-success'>Reorder</p>
                    </a>
                  </div>
                </div>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Alerts;