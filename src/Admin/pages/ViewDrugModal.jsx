import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const ViewDrugModal = ({ show, onHide, item }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Drug Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Basic Information</h5>
        <Table bordered>
          <tbody>
            <tr>
              <td><strong>Brand Name</strong></td>
              <td>{item.brandName}</td>
            </tr>
            <tr>
              <td><strong>Generic Name</strong></td>
              <td>{item.genericName}</td>
            </tr>
            <tr>
              <td><strong>Dosage</strong></td>
              <td>{item.dosage}</td>
            </tr>
            <tr>
              <td><strong>Category</strong></td>
              <td>{item.category}</td>
            </tr>
            <tr>
              <td><strong>Current Stock</strong></td>
              <td>{item.currentStock} units</td>
            </tr>
          </tbody>
        </Table>

        <h5 className="mt-4">Batch Details</h5>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {item.batches.map((batch, index) => (
              <tr key={index}>
                <td>{batch.batchNumber}</td>
                <td>{batch.quantity} units</td>
                <td>{new Date(batch.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDrugModal;