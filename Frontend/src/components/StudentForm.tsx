import React, { useState } from "react";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [neptunCode, setNeptunCode] = useState("");
  const [assignment, setAssignment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !neptunCode || !assignment || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }
    console.log({ name, neptunCode, assignment, file });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Neptun Code:
        <input
          type="text"
          value={neptunCode}
          onChange={e => setNeptunCode(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Assignment:
        <select
          value={assignment}
          onChange={e => setAssignment(e.target.value)}
          required
        >
          <option value="">Select assignment</option>
          <option value="Assignment 1">Assignment 1</option>
          <option value="Assignment 2">Assignment 2</option>
        </select>
      </label>
      <br />
      <label>
        Upload file:
        <input
          type="file"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentForm;