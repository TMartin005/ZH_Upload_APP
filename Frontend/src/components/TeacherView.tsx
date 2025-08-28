import React, { useEffect, useState } from 'react';
import type { StudentSubmission } from '../interfaces/ZH';
const TeacherView: React.FC = () => {
    const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

    useEffect(() => {
        // Fetch submissions from local storage or a local folder
        const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        setSubmissions(storedSubmissions);
    }, []);

    return (
        <div>
            <h1>Student Submissions</h1>
            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <ul>
                    {submissions.map((submission, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {submission.studentName} <br />
                            <strong>Neptun Code:</strong> {submission.neptunCode} <br />
                            <strong>Assignment:</strong> {submission.assignmentName} <br />
                            {/* <strong>File:</strong> <a href={submission.filePath} target="_blank" rel="noopener noreferrer">View Submission</a> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeacherView;