import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";
import Modal from "react-modal";

const TeacherView: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [newAssignment, setNewAssignment] = useState("");
  const host = import.meta.env.VITE_HOST;
  const port = import.meta.env.VITE_PORT;
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
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

  return (
    <div>
      <h2>Assignment Management</h2>
      <input
        type="text"
        value={newAssignment}
        onChange={(e) => setNewAssignment(e.target.value)}
        placeholder="New assignment name"
      />
      <button onClick={handleAddAssignment}>Add Assignment</button>
      <div style={{ marginTop: "10px" }}>
        <strong>Assignments:</strong>
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
          Activate Selected Assignments
        </button>
      </div>
      <hr />
      <div>
        <strong>Active Assignments for Students:</strong>{" "}
        {activeAssignments.join(", ")}
      </div>
      <hr />
      <label htmlFor="assignment-select">
        <strong>Select Assignment to View Submissions:</strong>
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
        <p>No submissions yet for this assignment.</p>
      ) : (
        <ul>
          {filteredSubmissions.map((submission, index) => (
            <li key={index}>
              <strong>Name:</strong> {submission.studentName} <br />
              <strong>Neptun Code:</strong> {submission.neptunCode} <br />
              <strong>Assignment:</strong> {submission.assignmentName} <br />
              <strong>File: </strong>
              <a
                href={`http://${host}:${port}/${submission.assignmentName}/${submission.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {submission.fileName} <br />
              </a>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <div>
      </div>
    </div>
  );
};

export default TeacherView;
