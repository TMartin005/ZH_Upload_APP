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

  const allowedExtensions = [".c", ".cpp", ".py"];
  const allowedAdditionalExtensions = [".csv"];
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
  if (selectedFile) {
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Csak .c, .cpp vagy .py fájlokat tölthetsz fel!");
      event.target.value = "";
      setFile(null);
      setFileContent(null);
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = e => setFileContent(e.target.result as string);
    reader.readAsText(selectedFile);
  }
};

  const handleAdditionalFileClick = event => {
    event.target.value = "";
  };

const handleAdditionalFileChange = event => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!allowedAdditionalExtensions.includes(ext)) {
      alert("Csak .csv fájlt tölthetsz fel!");
      event.target.value = "";
      setAdditionalFile(null);
      setAdditionalFileContent(null);
      return;
    }
    setAdditionalFile(selectedFile);
    const reader = new FileReader();
    reader.onload = e => setAdditionalFileContent(e.target.result as string);
    reader.readAsText(selectedFile);
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
      <table className="student-form-table">
        <tbody>
          <tr>
            <td>
              <label htmlFor="name">Név:</label>
            </td>
            <td colSpan={2}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="neptun">Neptun Kód:</label>
            </td>
            <td colSpan={2}>
              <input
                id="neptun"
                type="text"
                value={neptunCode}
                onChange={e => setNeptunCode(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="assignment">ZH:</label>
            </td>
            <td colSpan={2}>
              <select
                id="assignment"
                value={assignment}
                onChange={e => setAssignment(e.target.value)}
                required
              >
                <option value="">Válassz ZH-t</option>
                {activeAssignments.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <label>
                <input
                  type="checkbox"
                  checked={selfAuth}
                  onChange={() => setSelfAuth(!selfAuth)}
                  required
                />
                Én írtam a kódot.
              </label>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <label>
                <input
                  type="checkbox"
                  checked={aiAcknowledgment}
                  onChange={() => setAiAcknowledgment(!aiAcknowledgment)}
                  required
                />
                Elfogadom, hogy ha a kód AI által generált, akkor a ZH-t újra kell írni.
              </label>
            </td>
          </tr>
          <tr>
            <td colSpan={file ? 2 : 3} style={{ textAlign: "center" }}>
              <label>
                program fájl feltöltése:
                <input
                  type="file"
                  onClick={handleFileClick}
                  onChange={handleFileChange}
                  accept=".c,.cpp,.py"
                  required
                  style={{ display: "inline-block", marginLeft: "8px" }}
                />
              </label>
              {showFileModal && (
                <Modal content={fileContent} onClose={() => setShowFileModal(false)} />
              )}
            </td>
            {file && (
              <td className="view-link-cell">
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setShowFileModal(true);
                  }}
                  className="view-link"
                >
                  Megtekintés
                </a>
              </td>
            )}
          </tr>
          <tr>
            <td colSpan={additionalFile ? 2 : 3} style={{ textAlign: "center" }}>
              <label>
                csv fájl feltöltése (opcionális):
                <input
                  type="file"
                  onClick={handleAdditionalFileClick}
                  onChange={handleAdditionalFileChange}
                  accept=".csv"
                />
              </label>
            </td>
            {additionalFile && (
              <td className="view-link-cell">
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setShowAdditionalFileModal(true);
                  }}
                  className="view-link"
                >
                  Megtekintés
                </a>
                {showAdditionalFileModal && (
                  <Modal
                    content={additionalFileContent}
                    onClose={() => setShowAdditionalFileModal(false)}
                  />
                )}
              </td>
            )}
          </tr>
          <tr>
            <td colSpan={3}>
              <button type="submit">Beadás</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default StudentForm;