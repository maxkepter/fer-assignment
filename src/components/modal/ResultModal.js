import { Modal, Button } from "react-bootstrap";
export const ResultModal = ({ show, handleClose, score }) => {
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Exam Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your exam has been submitted successfully!</p>
        <p>Your Score: {score}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
