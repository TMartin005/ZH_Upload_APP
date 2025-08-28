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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        const fileName = `${studentName}_${neptunCode}_${assignmentName}${additionalFile ? `_${additionalFile.name}` : ''}`;
        
        formData.append('file', file, fileName);
        if (additionalFile) {
            formData.append('additionalFile', additionalFile, additionalFile.name);
        }

        // Simulate file upload
        // In a real application, you would send this to your backend
        console.log('Uploading files:', fileName);
        setUploadSuccess(true);
        // Here you would handle the actual upload logic
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