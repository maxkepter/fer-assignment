import { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, ListGroup } from "react-bootstrap";
import { ExamService } from "../../../service/exam/ExamService";
import { Link, useParams } from "react-router-dom";
import { ErrorModal } from "../../modal/ErrorModal";
function ExamDetail() {
  const examId = useParams().id;
  const [examData, setExamData] = useState({});
  const [examName, setExamName] = useState(examData.examName);
  const [duration, setDuration] = useState(examData.duration);
  const [questions, setQuestions] = useState(examData.questions || []);
  const [numberQuestion, setNumberQuestion] = useState(0);
  const [examError, setExamError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState([
    { optionContent: "", isCorrect: false },
    { optionContent: "", isCorrect: false },
  ]);

  useEffect(() => {
    ExamService.getExamById(examId)
      .then((data) => {
        setExamData(data);
        setExamName(data.examName);
        setDuration(data.duration);
        setQuestions(data.questions || []);
        setNumberQuestion(data.numberQuestion);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [examId]);

  // ---- Question management ----
  const handleAddOption = () => {
    setOptions([...options, { optionContent: "", isCorrect: false }]);
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const handleSelectCorrect = (index) => {
    const updatedOptions = [...options];
    updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect;
    setOptions(updatedOptions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleUpdateQuestion = (index) => {
    const questionToUpdate = questions[index];
    setQuestionContent(questionToUpdate.questionContent);
    setOptions(
      questionToUpdate.options.map((opt) => ({
        optionContent: opt.optionContent,
        isCorrect: opt.isCorrect,
      }))
    );
    setIsUpdateMode(true);
    setUpdateIndex(index);
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    // Validate
    if (!questionContent.trim()) {
      alert("Question content is required!");
      return;
    }
    if (options.some((o) => !o.optionContent.trim()) === true) {
      alert("All options must have content!");
      return;
    }
    if (!options.some((o) => o.isCorrect)) {
      alert("At least one option must be marked as correct!");
      return;
    }

    const newQuestion = {
      questionId: Date.now(),
      questionContent,
      options: options.map((opt, i) => ({
        optionId: Date.now() + i,
        ...opt,
      })),
    };

    if (isUpdateMode) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[updateIndex] = newQuestion;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    // Reset state
    setQuestionContent("");
    setOptions([
      { optionContent: "", isCorrect: false },
      { optionContent: "", isCorrect: false },
    ]);
    setIsUpdateMode(false);
    setShowModal(false);
  };

  const handleSaveExam = async () => {
    try {
      if (!examName.trim() || duration <= 0) {
        setExamError("Exam name and valid duration are required!");
        return;
      }
      if (questions.length === 0) {
        setExamError("At least one question is required!");
        return;
      }

      if (numberQuestion <= 0 || numberQuestion > questions.length) {
        setExamError(
          "Number of questions must be greater than 0 and less than or equal to total questions added!"
        );
        return;
      }

      const updatedExam = {
        ...examData,
        examName,
        duration,
        questions,
      };

      await ExamService.updateExam(examId, updatedExam);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      setExamError("Failed to update exam. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h3>Exam Detail</h3>

      <Row>
        <Col sm={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Exam Name</Form.Label>
              <Form.Control
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number Question</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={questions.length}
                placeholder="Enter duration"
                value={numberQuestion}
                onChange={(e) => setNumberQuestion(e.target.value)}
              />
            </Form.Group>
          </Form>

          {examError && <p className="text-danger">{examError}</p>}

          <div className="d-flex flex-column gap-2">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add Question
            </Button>
            <Button
              variant="success"
              onClick={handleSaveExam}
              disabled={questions.length === 0}
            >
              Save Changes
            </Button>
            <Link className="btn btn-secondary" to="../exam">
              Back to Exam List
            </Link>
          </div>
        </Col>

        <Col sm={8}>
          <h5 className="mt-4">Questions</h5>
          {questions.length === 0 ? (
            <p>No questions yet.</p>
          ) : (
            <ListGroup>
              {questions.map((q, index) => (
                <ListGroup.Item key={q.questionId}>
                  <Row>
                    <Col sm={10}>
                      <strong
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {q.questionContent}
                      </strong>
                    </Col>
                    <Col
                      sm={2}
                      className="text-end d-flex gap-2 justify-content-end"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateQuestion(index)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                  <ul className="mt-2">
                    {q.options.map((opt) => (
                      <li key={opt.optionId}>
                        {opt.optionContent}
                        {opt.isCorrect && (
                          <span style={{ color: "green" }}> (Correct)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Modal Add/Update Question */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setIsUpdateMode(false);
          }}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {isUpdateMode ? "Update Question" : "Add Question"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter question content"
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                />
              </Form.Group>

              <h6>Options</h6>
              {options.map((opt, index) => (
                <Row key={index} className="mb-2 align-items-center">
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={opt.optionContent}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          "optionContent",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col sm={3}>
                    <Form.Check
                      type="checkbox"
                      label="Correct"
                      checked={opt.isCorrect}
                      onChange={() => handleSelectCorrect(index)}
                    />
                  </Col>
                  <Col sm={2}>
                    {options.length > 2 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setOptions(options.filter((_, i) => i !== index))
                        }
                      >
                        X
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <Button variant="secondary" size="sm" onClick={handleAddOption}>
                + Add Option
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setIsUpdateMode(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddQuestion}>
              {isUpdateMode ? "Update Question" : "Add Question"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
        >
          <Modal.Header>
            <Modal.Title>Exam Created</Modal.Title>
          </Modal.Header>
          <Modal.Body>The exam has been created successfully!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </Button>
            <Link className="btn btn-secondary" to="../exam">
              Back to Exam List
            </Link>
          </Modal.Footer>
        </Modal>
        <ErrorModal
          {...{
            show: errorMessage,
            onHide: () => {
              setErrorMessage("");
              window.history.back();
            },
            message: errorMessage,
          }}
        ></ErrorModal>
      </Row>
    </div>
  );
}

export default ExamDetail;
