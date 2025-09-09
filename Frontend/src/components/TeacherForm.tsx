import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";


const TeacherForm: React.FC = () => {
  const [assignments, setAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedAssignment_list, setSelectedAssignment_list] = useState<string>("");
  const host = import.meta.env.VITE_SERVER_IP;
  const port = import.meta.env.VITE_PORT;

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

  const filteredSubmissions = submissions.filter(
    (submission) => submission.assignmentName === selectedAssignment_list
  );

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
            {assignment}
          </li>
        ))}
      </ul>
      <button onClick={handleActivateAssignments}>
        Kijelölt feladatok aktiválása
      </button>
    </div>
  );
};

export default TeacherForm;