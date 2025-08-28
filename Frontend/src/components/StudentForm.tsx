import React, { useState } from 'react';

const StudentForm = () => {
    const [name, setName] = useState('');
    const [neptunCode, setNeptunCode] = useState('');
    const [assignment, setAssignment] = useState('');
    const [selfAuth, setSelfAuth] = useState(false);
    const [aiAcknowledgment, setAiAcknowledgment] = useState(false);
    const [file, setFile] = useState(null);
    const [additionalFile, setAdditionalFile] = useState(null);
    const [assignments, setAssignments] = useState(['Assignment 1', 'Assignment 2']); // Editable list of assignments

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAdditionalFileChange = (event) => {
        setAdditionalFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name || !neptunCode || !assignment || !selfAuth || !aiAcknowledgment || !file) {
            alert('Please fill in all required fields and upload a file.');
            return;
        }

        const fileName = `${name}_${neptunCode}_${assignment}${additionalFile ? `_${additionalFile.name}` : ''}`;
        const formData = new FormData();
        formData.append('file', file, fileName);
        if (additionalFile) {
            formData.append('additionalFile', additionalFile, additionalFile.name);
        }

        // Handle file upload logic here (e.g., save to local storage or server)

        alert('Files submitted successfully!');
        // Clear form fields after submission
        setName('');
        setNeptunCode('');
        setAssignment('');
        setSelfAuth(false);
        setAiAcknowledgment(false);
        setFile(null);
        setAdditionalFile(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Neptun Code:
                    <input type="text" value={neptunCode} onChange={(e) => setNeptunCode(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Assignment:
                    <select value={assignment} onChange={(e) => setAssignment(e.target.value)} required>
                        <option value="">Select an assignment</option>
                        {assignments.map((assign, index) => (
                            <option key={index} value={assign}>{assign}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={selfAuth} onChange={() => setSelfAuth(!selfAuth)} required />
                    I confirm that I wrote the code myself.
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={aiAcknowledgment} onChange={() => setAiAcknowledgment(!aiAcknowledgment)} required />
                    I acknowledge that if the code seems AI-generated, the assignment might need to be rewritten.
                </label>
            </div>
            <div>
                <label>
                    Upload .c/.cpp file:
                    <input type="file" accept=".c,.cpp" onChange={handleFileChange} required />
                </label>
            </div>
            <div>
                <label>
                    Upload additional file (optional):
                    <input type="file" accept=".csv" onChange={handleAdditionalFileChange} />
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default StudentForm;