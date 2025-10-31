import React from "react";
import { Modal } from "react-bootstrap";
export const ErrorModal = ({ show, onHide, message }) => {
  return (
    <Modal show={show} onHide={onHide} onEscapeKeyDown={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
