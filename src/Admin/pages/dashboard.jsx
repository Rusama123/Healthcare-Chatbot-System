import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/dashboard.css';
import money from "../../assets/money.svg";
import triangle from "../../assets/triangle.svg";
import vector from "../../assets/vector.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../header-footer/header';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalInventoryValue: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    totalSalesValue: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard data...'); // Debug log
      
      const res = await axios.get('http://localhost:5000/api/dashboard');
      console.log('Dashboard data received:', res.data); // Debug log
      
      setDashboardData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      
      // Set default values on error
      setDashboardData({
        totalInventoryValue: 0,
        lowStockCount: 0,
        expiringSoonCount: 0,
        totalSalesValue: 0,
        recentSales: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `Rs: ${value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <Header />
      <div className='container-d'>
        <h1>Dashboard</h1>
        {error && (
          <div className="alert alert-warning" role="alert">
            Error loading data: {error}. Showing default values.
          </div>
        )}
      </div>
      
      <div className='container-d'>
        <div className='Boxs row'>
          <div className='Box col'>
            <div className='box-heading'>
              <p>Total Inventory Value</p>
              <img src={money} alt="money" />
            </div>
            <div className='box-discription'>
              <h2>
                {loading ? 'Loading...' : formatCurrency(dashboardData.totalInventoryValue)}
              </h2>
            </div>
          </div>

          <div className='Box col'>
            <div className='box-heading'>
              <p>Low Stock Items</p>
              <img src={triangle} alt="warning" />
            </div>
            <div className='box-discription'>
              <h2 className="text-danger">
                {loading ? '...' : dashboardData.lowStockCount}
              </h2>
            </div>
          </div>

          <div className='Box col'>
            <div className='box-heading'>
              <p>Expiring Soon</p>
              <img src={vector} alt="alert" />
            </div>
            <div className='box-discription'>
              <h2 className="text-danger">
                {loading ? '...' : dashboardData.expiringSoonCount}
              </h2>
            </div>
          </div>

          <div className='Box col'>
            <div className='box-heading'>
              <p>Total Sales Value</p>
              <img src={money} alt="money" />
            </div>
            <div className='box-discription'>
              <h2>
                {loading ? 'Loading...' : formatCurrency(dashboardData.totalSalesValue)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className='container-d inventory-container'>
        <div className='inventory'>
          <h2>Recent Sales Activity</h2>
          <div className='inventory-graph'>
            {loading ? (
              <p className='text-center py-4'>Loading sales data...</p>
            ) : dashboardData.recentSales && dashboardData.recentSales.length > 0 ? (
              <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentSales.slice(0, 10).map((sale, index) => (
                      <tr key={index}>
                        <td>{new Date(sale.date).toLocaleDateString()}</td>
                        <td>{sale.brandName}</td>
                        <td>{sale.quantity} units</td>
                        <td>{formatCurrency(sale.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-center py-4'>No sales data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;