import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddDrugModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    genericName: '',
    dosage: '',
    category: '',
    unitPrice: '',
    boxPrice: '',
    unitsPerBox: ''
  });

  const [batches, setBatches] = useState([
    { batchNumber: '', quantity: '', expiryDate: '' }
  ]);

  const [currentStock, setCurrentStock] = useState(0);

  // Calculate current stock whenever batches change
  useEffect(() => {
    const totalStock = batches.reduce((sum, batch) => {
      const qty = parseInt(batch.quantity) || 0;
      return sum + qty;
    }, 0);
    setCurrentStock(totalStock);
  }, [batches]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBatchChange = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const addBatch = () => {
    setBatches([...batches, { batchNumber: '', quantity: '', expiryDate: '' }]);
  };

  const removeBatch = (index) => {
    const newBatches = batches.filter((_, i) => i !== index);
    setBatches(newBatches);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const batchesData = batches.map(batch => ({
        ...batch,
        quantity: parseInt(batch.quantity)
      }));

      await axios.post('http://localhost:5000/api/inventory', {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        boxPrice: parseFloat(formData.boxPrice),
        unitsPerBox: parseInt(formData.unitsPerBox),
        batches: batchesData
      });

      onHide();
      onSuccess();
      
      // Reset form
      setFormData({
        brandName: '',
        genericName: '',
        dosage: '',
        category: '',
        unitPrice: '',
        boxPrice: '',
        unitsPerBox: ''
      });
      setBatches([{ batchNumber: '', quantity: '', expiryDate: '' }]);
    } catch (err) {
      console.error(err);
      alert('Error adding drug');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Drug</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="e.g., Panadol"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Generic Name</Form.Label>
                <Form.Control
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleChange}
                  placeholder="e.g., Paracetamol"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dosage</Form.Label>
                <Form.Control
                  type="text"
                  name="dosage"
                  placeholder="e.g., 500 mg"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  placeholder="e.g., Pain Relievers"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Unit Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="unitPrice"
                  placeholder="e.g., 5.99"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Box Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="boxPrice"
                  placeholder="e.g., 59.99"
                  value={formData.boxPrice}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Units Per Box</Form.Label>
                <Form.Control
                  type="number"
                  name="unitsPerBox"
                  placeholder="e.g., 10"
                  value={formData.unitsPerBox}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          
          {/* Current Stock Display */}
          <Alert variant="info" className="d-flex justify-content-between align-items-center">
            <span><strong>Total Current Stock:</strong> (Auto-calculated from batches)</span>
            <h4 className="mb-0">
              <span className="badge bg-primary">{currentStock} units</span>
            </h4>
          </Alert>

          <h5>Batch Information</h5>

          {batches.map((batch, index) => (
            <div key={index} className="border p-3 mb-3 rounded">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>Batch {index + 1}</h6>
                {batches.length > 1 && (
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => removeBatch(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Batch Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={batch.batchNumber}
                      onChange={(e) => handleBatchChange(index, 'batchNumber', e.target.value)}
                      placeholder="e.g., BATCH001"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={batch.quantity}
                      onChange={(e) => handleBatchChange(index, 'quantity', e.target.value)}
                      placeholder="e.g., 1500"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={batch.expiryDate}
                      onChange={(e) => handleBatchChange(index, 'expiryDate', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          ))}

          <Button variant="secondary" onClick={addBatch} className="mb-3">
            + Add Another Batch
          </Button>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add Drug
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDrugModal;