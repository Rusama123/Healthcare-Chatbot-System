import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const EditDrugModal = ({ show, onHide, item, onSuccess }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    genericName: '',
    dosage: '',
    category: '',
    unitPrice: '',
    boxPrice: '',
    unitsPerBox: '',
    barcode: ''
  });

  const [batches, setBatches] = useState([
    { batchNumber: '', quantity: '', expiryDate: '' }
  ]);

  useEffect(() => {
    if (item) {
      setFormData({
        brandName: item.brandName || '',
        genericName: item.genericName || '',
        dosage: item.dosage || '',
        category: item.category || '',
        unitPrice: item.unitPrice || '',
        boxPrice: item.boxPrice || '',
        unitsPerBox: item.unitsPerBox || '',
        barcode: item.barcode || ''
      });
      
      if (item.batches && item.batches.length > 0) {
        setBatches(item.batches.map(batch => ({
          ...batch,
          expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().split('T')[0] : ''
        })));
      }
    }
  }, [item]);

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

      await axios.put(`http://localhost:5000/api/inventory/${item._id}`, {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        boxPrice: parseFloat(formData.boxPrice),
        unitsPerBox: parseInt(formData.unitsPerBox),
        barcode: formData.barcode || undefined,
        batches: batchesData
      });

      onHide();
      onSuccess();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message?.includes('barcode')) {
        alert('This barcode is already in use. Please use a different barcode.');
      } else {
        alert('Error updating drug');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Drug</Modal.Title>
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
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Barcode (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="barcode"
                  placeholder="e.g., 1234567890123"
                  value={formData.barcode}
                  onChange={handleChange}
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
                  value={formData.unitsPerBox}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
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
            <Button variant="primary" type="submit">
              Update Drug
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDrugModal;