import React, { useEffect, useState } from "react";

// Modal component for displaying file content
const Modal = ({ content, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "gray",
        padding: 24,
        borderRadius: 8,
        maxWidth: "80vw",
        maxHeight: "80vh",
        overflow: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const StudentForm = () => {
  // -------------------- State --------------------
  // Form fields
  const [name, setName] = useState("");
  const [neptunCode, setNeptunCode] = useState("");
  const [assignment, setAssignment] = useState("");
  const [selfAuth, setSelfAuth] = useState(false);
  const [aiAcknowledgment, setAiAcknowledgment] = useState(false);

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);

  // Assignment lists
  const [assignments, setAssignments] = useState([
    "Assignment 1",
    "Assignment 2",
  ]);
  const [activeAssignments, setActiveAssignments] = useState<string[]>([]);

  // Upload status
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Modal and file content states
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [additionalFileContent, setAdditionalFileContent] = useState<string | null>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showAdditionalFileModal, setShowAdditionalFileModal] = useState(false);

  // Host/port config
  const host = import.meta.env.VITE_SERVER;
  const port = import.meta.env.VITE_PORT;

  // -------------------- Effects --------------------
  // Fetch assignments from server on mount
  useEffect(() => {
    fetch(`http://${host}:${port}/api/zh_types`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setActiveAssignments(data.active || []);
        setAssignment((data.active && data.active[0]) || "");
      });
  }, []);

  // -------------------- Handlers --------------------
  // File input click: reset input to allow re-uploading same file
  const handleFileClick = (event) => {
    const input = event.target;
    input.value = "";
  };

  // File change: set file and read content
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result as string);
        // Validation logic can be added here
      };
      reader.readAsText(selectedFile);
    }
  };

  // Additional file input click: reset input
  const handleAdditionalFileClick = (event) => {
    const input = event.target;
    input.value = "";
  };

  // Additional file change: set file and read content
  const handleAdditionalFileChange = (event) => {
    setAdditionalFile(event.target.files[0]);
    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdditionalFileContent(e.target.result as string);
      };
      reader.readAsText(event.target.files[0]);
    }
  };

  // Form submit: validate and upload
const handleSubmit = async (event) => {
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

        // Use only the main file's extension for its name
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
                `http://${host}:${port}/api/students/submit`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (response.ok) {
                setUploadSuccess(true);
                // Clear form fields after submission
                setName("");
                setNeptunCode("");
                setAssignment("");
                setSelfAuth(false);
                setAiAcknowledgment(false);
                setFile(null);
                setAdditionalFile(null);
            } else {
                setUploadSuccess(false);
                const errorData = await response.json();
                alert(`Upload failed: ${errorData.message}`);
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setNeptunCode(e.target.value)}
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
                onChange={(e) => setAssignment(e.target.value)}
                required
              >
                <option value="">Válassz ZH-t</option>
                {activeAssignments.map((a) => (
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
           <td colSpan={2}>
              <label>
                .c/.cpp fájl feltöltése:
                <input
                  type="file"
                  /* accept=".c,.cpp" */
                  onClick={handleFileClick}
                  onChange={handleFileChange}
                  required
                />
              </label>
            </td>
            <td>
              {file && (
                <span
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => setShowFileModal(true)}
                >
                  {file.name}
                </span>
              )}
              {showFileModal && (
                <Modal content={fileContent} onClose={() => setShowFileModal(false)} />
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <label>
                egyéb fájl feltöltése (opcionális):
                <input
                  type="file"
                  /* accept=".csv" */
                  onClick={handleAdditionalFileClick}
                  onChange={handleAdditionalFileChange}
                />
              </label>
            </td>
            <td>
              {additionalFile && (
                <span
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => setShowAdditionalFileModal(true)}
                >
                  {additionalFile.name}
                </span>
              )}
              {showAdditionalFileModal && (
                <Modal content={additionalFileContent} onClose={() => setShowAdditionalFileModal(false)} />
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button type="submit">Beadás</button>
              {uploadSuccess && <p>Upload successful!</p>}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default StudentForm;