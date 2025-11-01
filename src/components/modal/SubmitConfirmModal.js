import { Modal, Button } from "react-bootstrap";

function SubmitConfirmModal({
  show,
  setShowSubmit,
  handleSubmit,
  answered,
  total,
}) {
  return (
    <Modal
      show={show}
      onHide={() => setShowSubmit(false)}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Verify exam submission</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You have answered {answered}/{total} questions. Submit now?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSubmit(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Exam
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SubmitConfirmModal;
