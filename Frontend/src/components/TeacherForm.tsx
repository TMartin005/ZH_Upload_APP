import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";

// Modal for viewing code file contents
const Modal = ({ content, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <pre>{content}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const TeacherForm: React.FC = () => {
  const [assignments, setAssignments] = useState<string[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedAssignment_list, setSelectedAssignment_list] = useState<string>("");

  const host = import.meta.env.VITE_SERVER_IP;
  const port = import.meta.env.VITE_PORT;
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setSelectedAssignments(data.active || []);
      });
  }, []);

  const handleAddAssignment = async () => {
    if (!newAssignment.trim()) return;
    const updatedAssignments = [...assignments, newAssignment.trim()];
    await fetch(`http://${host}:${port}/api/zh_types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignments: updatedAssignments,
        active: activeAssignments,
      }),
    });
    setNewAssignment("");
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setSelectedAssignments(data.active || []);
      });
  };

  useEffect(() => {
    fetch(`http://${host}:${port}/api/teachers/submissions`)
      .then((res) => res.json())
      .then((data) => {
        const flat = Object.entries(data).flatMap(([assignment, files]) =>
          (Array.isArray(files) ? files : []).map((sub) => ({
            ...sub,
            assignmentName: assignment,
          }))
        );
        setSubmissions(flat);
        setSelectedAssignment_list(Object.keys(data)[0] || "");
      });
  }, []);

  const handleCheckboxChange = (assignment: string) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignment)
        ? prev.filter((a) => a !== assignment)
        : [...prev, assignment]
    );
  };

  const handleActivateAssignments = async () => {
    await fetch(`http://${host}:${port}/api/zh_types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignments, active: selectedAssignments }),
    });
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setSelectedAssignments(data.active || []);
      });
  };

  const filteredSubmissions = submissions.filter(
    (submission) => submission.assignmentName === selectedAssignment_list
  );

  // Check if the file is a code file (.c or .cpp or .py)
  const isCodeFile = (submission: StudentSubmission) => {
    const regex = new RegExp(
      `^${submission.studentName}_${submission.neptunCode}_${submission.assignmentName}(\\.c|\\.cpp|\\.py)?$`
    );
    return regex.test(submission.fileName);
  };

  // Fetch and show file content in modal
  const fetchFileContent = async (submission: StudentSubmission) => {
    let fileUrl = `http://${host}:${port}/${submission.assignmentName}/${submission.fileName}`;
    if (!/\.[^.]+$/.test(submission.fileName)) {
      fileUrl = `http://${host}:${port}/${submission.assignmentName}/${submission.fileName}/${submission.fileName}`;
    }
    try {
      const res = await fetch(fileUrl);
      const text = await res.text();
      setModalContent(text);
      setShowModal(true);
    } catch {
      setModalContent("Nem sikerült betölteni a fájlt.");
      setShowModal(true);
    }
  };

  return (
    <div className="teacher-container">
      <h1>Tanár nézet</h1>
      <div className="teacher-table">
        <div className="teacher-row">
          <div className="teacher-cell">
            <h2>ZH-k kezelése</h2>
            <input
              type="text"
              value={newAssignment}
              onChange={(e) => setNewAssignment(e.target.value)}
              placeholder="Új ZH neve"
            />
            <button onClick={handleAddAssignment}>Új ZH hozzáadása</button>
            <div style={{ marginTop: "10px" }}>
              <strong>ZH-k:</strong>
              <ul>
                {assignments.map((assignment) => (
                  <li key={assignment}>
                    <input
                      type="checkbox"
                      checked={selectedAssignments.includes(assignment)}
                      onChange={() => handleCheckboxChange(assignment)}
                    />
                    {assignment}
                  </li>
                ))}
              </ul>
              <button onClick={handleActivateAssignments}>
                Kiválasztott ZH-k aktiválása
              </button>
            </div>
            <hr />
            <div>
              <strong>Aktív ZH-k a hallgatók számára:</strong>{" "}
              {activeAssignments.join(", ")}
            </div>
          </div>
          <div className="teacher-cell">
            <h2>ZH-k megtekintése</h2>
            <label htmlFor="assignment-select">
              <strong> Beküldött ZH-k megtekintése:</strong>
            </label>
            <select
              id="assignment-select"
              value={selectedAssignment_list}
              onChange={(e) => setSelectedAssignment_list(e.target.value)}
            >
              {Object.keys(
                submissions.reduce((acc, sub) => {
                  acc[sub.assignmentName] = true;
                  return acc;
                }, {})
              ).map((assignment) => (
                <option key={assignment} value={assignment}>
                  {assignment}
                </option>
              ))}
            </select>
            {filteredSubmissions.length === 0 ? (
              <p>Nincs még beküldés ehhez a ZH-hoz.</p>
            ) : (
              <div className="zh-list-container">
                <ul>
                  {filteredSubmissions.map((submission, index) => (
                    <li key={index}>
                      <strong>Név:</strong> {submission.studentName} <br />
                      <strong>Neptun Kód:</strong> {submission.neptunCode} <br />
                      <strong>ZH:</strong> {submission.assignmentName} <br />
                      <strong>Fájl: </strong>
                      {submission.fileName}
                      {isCodeFile(submission) && (
                        <>
                          {" "}
                          <a
                            href="#"
                            className="megtekintes-link"
                            onClick={(e) => {
                              e.preventDefault();
                              fetchFileContent(submission);
                            }}
                          >
                            Megtekintés
                          </a>
                        </>
                      )}
                      <br />
                      <hr className="zh-separator" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;