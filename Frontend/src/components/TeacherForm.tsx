import React, { useState } from "react";

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
        placeholder="New assignment name"
      />
      <button onClick={handleAddAssignment}>Add Assignment</button>
      <ul>
        {assignments.map((assignment, idx) => (
          <li key={idx}>{assignment}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherForm;