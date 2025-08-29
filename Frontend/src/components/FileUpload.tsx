import React, { useState } from 'react';
import type { StudentSubmission } from '../interfaces/ZH';
const FileUpload = ({ studentName, neptunCode, assignmentName }: StudentSubmission) => {
    const [file, setFile] = useState(null);
    const [additionalFile, setAdditionalFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAdditionalFileChange = (event) => {
        setAdditionalFile(event.target.files[0]);
    };

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    const fileName = `${studentName}_${neptunCode}_${assignmentName}${additionalFile ? `_${additionalFile.name}` : ''}`;
    formData.append('file', file, fileName);
    if (additionalFile) {
        formData.append('additionalFile', additionalFile, additionalFile.name);
    }
    formData.append('name', studentName);
    formData.append('neptunCode', neptunCode);
    formData.append('assignment', assignmentName);

    try {
        const response = await fetch('http://localhost:3000/api/students/submit', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            setUploadSuccess(true);
        } else {
            setUploadSuccess(false);
            alert('Upload failed.');
        }
    } catch (error) {
        setUploadSuccess(false);
        alert('Error uploading file.');
    }
};
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".c,.cpp" onChange={handleFileChange} required />
                <input type="file" accept=".csv" onChange={handleAdditionalFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadSuccess && <p>Upload successful!</p>}
        </div>
    );
};

export default FileUpload;