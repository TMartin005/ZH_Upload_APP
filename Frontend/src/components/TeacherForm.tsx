import React, { useState } from "react";

const TeacherForm: React.FC = () => {
  const [assignments, setAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState("");

  const handleAddAssignment = () => {
    if (!newAssignment.trim()) return;
    setAssignments([...assignments, newAssignment.trim()]);
    setNewAssignment("");
  };

  return (
    <div>
       <h1>Tanár nézet</h1>
    </div>
  );
};

export default TeacherForm;