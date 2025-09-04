import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";
import "../pages/TeacherPage.css"; // Import the CSS
// Modal component for displaying file content (copied from StudentForm.tsx)
const Modal = ({ content, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <pre>{content}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
const TeacherView: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [newAssignment, setNewAssignment] = useState("");
  const host = import.meta.env.VITE_SERVER;
  const port = import.meta.env.VITE_PORT;
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
    const [modalContent, setModalContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch assignments from server
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
    // Re-fetch assignments and active
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setSelectedAssignments(data.active || []);
      });
  };

  // Fetch submissions
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
        setSelectedAssignment(Object.keys(data)[0] || "");
      });
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (assignment: string) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignment)
        ? prev.filter((a) => a !== assignment)
        : [...prev, assignment]
    );
  };
  // Activate selected assignments
  const handleActivateAssignments = async () => {
    await fetch(`http://${host}:${port}/api/zh_types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignments, active: selectedAssignments }),
    });
    // Re-fetch assignments and active
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setSelectedAssignments(data.active || []);
      });
  };

  // Filter submissions by selected assignment
  const filteredSubmissions = submissions.filter(
    (submission) => submission.assignmentName === selectedAssignment
  );
   // Helper: Check if file is code file (name_code_zh.ext)
  const isCodeFile = (submission: StudentSubmission) => {
    const regex = new RegExp(
      `^${submission.studentName}_${submission.neptunCode}_${submission.assignmentName}(\\.c|\\.cpp)?$`
    );
    return regex.test(submission.fileName);
  };
  // Helper: Fetch file content
  const fetchFileContent = async (submission: StudentSubmission) => {
    let fileUrl = `http://${host}:${port}/${submission.assignmentName}/${submission.fileName}`;
    // If fileName is a folder, fetch file inside with same name
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
          {/* Assignment Management Column */}
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
          {/* Assignment View Column */}
          <div className="teacher-cell">
            <h2>ZH-k megtekintése</h2>
            <label htmlFor="assignment-select">
              <strong> Beküldött ZH-k megtekintése:</strong>
            </label>
            <select
              id="assignment-select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              style={{ marginLeft: "10px", marginBottom: "20px" }}
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
              <ul>
                {filteredSubmissions.map((submission, index) => (
                  <li key={index}>
                    <strong>Név:</strong> {submission.studentName} <br />
                    <strong>Neptun Kód:</strong> {submission.neptunCode} <br />
                    <strong>ZH:</strong> {submission.assignmentName} <br />
                    <strong>Fájl: </strong>
                    <a
                      href={`http://${host}:${port}/${submission.assignmentName}/${submission.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {submission.fileName} <br />
                    </a>{isCodeFile(submission) && (
                      <>
                        {" "}
                        <button
                          style={{ marginLeft: "8px" }}
                          onClick={() => fetchFileContent(submission)}
                        >
                          Megtekintés
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
           {showModal && (
  <Modal
    content={modalContent}
    onClose={() => setShowModal(false)}
  />
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;