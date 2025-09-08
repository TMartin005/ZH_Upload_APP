import React, { useState, useEffect } from "react";

// Modal component for displaying file content
const Modal = ({ content, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <pre>{content}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const StudentForm = () => {
  const [name, setName] = useState("");
  const [neptunCode, setNeptunCode] = useState("");
  const [assignment, setAssignment] = useState("");
  const [selfAuth, setSelfAuth] = useState(false);
  const [aiAcknowledgment, setAiAcknowledgment] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);

  const [assignments, setAssignments] = useState<string[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [additionalFileContent, setAdditionalFileContent] = useState<string | null>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showAdditionalFileModal, setShowAdditionalFileModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/zh_types")
      .then(res => res.json())
      .then(data => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setAssignment((data.active && data.active[0]) || "");
      });
  }, []);

  const handleFileClick = event => {
    event.target.value = "";
  };

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = e => setFileContent(e.target.result as string);
      reader.readAsText(selectedFile);
    }
  };

  const handleAdditionalFileClick = event => {
    event.target.value = "";
  };

  const handleAdditionalFileChange = event => {
    setAdditionalFile(event.target.files[0]);
    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = e => setAdditionalFileContent(e.target.result as string);
      reader.readAsText(event.target.files[0]);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (
      !name ||
      !neptunCode ||
      !assignment ||
      !selfAuth ||
      !aiAcknowledgment ||
      !file
    ) {
      alert("Please fill in all required fields and upload a file.");
      return;
    }
    const mainFileExt = file.name.substring(file.name.lastIndexOf('.'));
    const fileName = `${name}_${neptunCode}_${assignment}${mainFileExt}`;
    const formData = new FormData();
    formData.append("file", file, fileName);
    if (additionalFile) {
      formData.append("additionalFile", additionalFile, additionalFile.name);
    }
    formData.append("name", name);
    formData.append("neptunCode", neptunCode);
    formData.append("assignment", assignment);
    formData.append("wroteCode", selfAuth ? "true" : "false");
    formData.append("aiAcknowledgment", aiAcknowledgment ? "true" : "false");

    try {
      const response = await fetch(
        "http://localhost:3000/api/students/submit",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        setUploadSuccess(true);
        setName("");
        setNeptunCode("");
        setAssignment("");
        setSelfAuth(false);
        setAiAcknowledgment(false);
        setFile(null);
        setAdditionalFile(null);
        window.alert("Upload successful!");
      } else {
        setUploadSuccess(false);
        alert("Upload failed.");
      }
    } catch (error) {
      setUploadSuccess(false);
      alert("Error uploading file. Please try again.");
    }
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