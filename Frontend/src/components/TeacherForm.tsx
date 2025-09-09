import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";


const TeacherForm: React.FC = () => {
  const [assignments, setAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  const handleAddAssignment = () => {
    if (!newAssignment.trim()) return;
    setAssignments([...assignments, newAssignment.trim()]);
    setNewAssignment("");
  };

  const handleCheckboxChange = (assignment: string) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignment)
        ? prev.filter((a) => a !== assignment)
        : [...prev, assignment]
    );
  };

  const handleActivateAssignments = () => {
    alert("Activated assignments: " + selectedAssignments.join(", "));
  };

  return (
    <div>
       <h1>Tanár nézet</h1>
      <input
        type="text"
        value={newAssignment}
        onChange={(e) => setNewAssignment(e.target.value)}
        placeholder="Új feladat neve"
      />
      <button onClick={handleAddAssignment}>Feladat hozzáadása</button>
      <ul>
        {assignments.map((assignment, idx) => (
          <li key={idx}>
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
        Kijelölt feladatok aktiválása
      </button>
    </div>
  );
};

export default TeacherForm;