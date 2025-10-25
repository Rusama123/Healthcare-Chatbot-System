import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const BarcodeScanner = ({ show, onHide, onSuccess, mode = 'add' }) => {
  // mode can be 'add' (for adding medicine) or 'sell' (for selling medicine)
  const [barcode, setBarcode] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    if (show && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [show]);

  // Handle barcode input (listens for scanner or manual entry)
  const handleBarcodeInput = async (e) => {
    const code = e.target.value.trim();
    setBarcode(code);
    
    // Auto-search when barcode is entered (typically 8-13 digits)
    if (code.length >= 8) {
      await searchByBarcode(code);
    }
  };

  // Search inventory by barcode
  const searchByBarcode = async (code) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/inventory/barcode/${code}`);
      setScannedItem(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Medicine not found with this barcode');
        setScannedItem(null);
      } else {
        setError('Error searching for medicine');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle selling medicine
  const handleSell = async () => {
    if (!scannedItem || quantity <= 0) return;

    if (quantity > scannedItem.currentStock) {
      setError(`Insufficient stock. Available: ${scannedItem.currentStock} units`);
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/sales', {
        inventoryId: scannedItem._id,
        quantity: parseInt(quantity),
        barcode: barcode
      });

      alert(`Sale recorded: ${quantity} unit(s) of ${scannedItem.brandName}`);
      onSuccess();
      resetForm();
      onHide();
    } catch (err) {
      setError('Error recording sale');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding medicine (quick stock addition via barcode)
  const handleAddStock = async () => {
    if (!scannedItem || quantity <= 0) return;

    try {
      setLoading(true);
      // Update the first batch quantity
      const updatedBatches = [...scannedItem.batches];
      if (updatedBatches.length > 0) {
        updatedBatches[0].quantity += parseInt(quantity);
      }

      await axios.put(`http://localhost:5000/api/inventory/${scannedItem._id}`, {
        ...scannedItem,
        batches: updatedBatches,
        currentStock: scannedItem.currentStock + parseInt(quantity)
      });

      alert(`Added ${quantity} unit(s) to ${scannedItem.brandName}`);
      onSuccess();
      resetForm();
      onHide();
    } catch (err) {
      setError('Error adding stock');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBarcode('');
    setScannedItem(null);
    setQuantity(1);
    setError('');
  };

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'sell' ? 'Scan to Sell Medicine' : 'Scan to Add Stock'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Barcode</Form.Label>
          <Form.Control
            ref={barcodeInputRef}
            type="text"
            value={barcode}
            onChange={handleBarcodeInput}
            placeholder="Scan or enter barcode..."
            autoFocus
          />
          <Form.Text className="text-muted">
            Scan barcode or enter manually
          </Form.Text>
        </Form.Group>

        {loading && (
          <Alert variant="info">Searching...</Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        {scannedItem && (
          <>
            <Alert variant="success">
              <h6>Medicine Found:</h6>
              <p className="mb-1"><strong>Brand:</strong> {scannedItem.brandName}</p>
              <p className="mb-1"><strong>Generic:</strong> {scannedItem.genericName}</p>
              <p className="mb-1"><strong>Dosage:</strong> {scannedItem.dosage}</p>
              <p className="mb-1"><strong>Current Stock:</strong> {scannedItem.currentStock} units</p>
              <p className="mb-1"><strong>Price:</strong> ${scannedItem.unitPrice?.toFixed(2)}/unit</p>
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>

            {mode === 'sell' && (
              <Alert variant="info">
                <strong>Total Amount:</strong> ${(scannedItem.unitPrice * quantity).toFixed(2)}
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { resetForm(); onHide(); }}>
          Cancel
        </Button>
        {scannedItem && (
          <Button 
            variant={mode === 'sell' ? 'success' : 'primary'}
            onClick={mode === 'sell' ? handleSell : handleAddStock}
            disabled={loading || !scannedItem || quantity <= 0}
          >
            {mode === 'sell' ? 'Complete Sale' : 'Add Stock'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BarcodeScanner;