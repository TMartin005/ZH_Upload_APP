import React, { useState, useEffect } from "react";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [neptunCode, setNeptunCode] = useState("");
  const [assignment, setAssignment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Assignment lists fetched from server
  const [assignments, setAssignments] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch assignments from server on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/zh_types")
      .then(res => res.json())
      .then(data => {
        setAssignments(data.assignments || []);
        setAssignment((data.assignments && data.assignments[0]) || "");
      });
  }, []);

  // Added file type validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile && ![".c", ".cpp", ".py"].some(ext => selectedFile.name.endsWith(ext))) {
      alert("Please upload a .c, .cpp, or .py file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !neptunCode || !assignment || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }
    // For now, just log the data
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
          {assignments.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Upload .c/.cpp file:
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentForm;