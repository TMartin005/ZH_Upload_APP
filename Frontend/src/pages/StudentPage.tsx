import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';

const StudentPage: React.FC = () => {
    const [lastSubmission, setLastSubmission] = useState<any>(null);

    useEffect(() => {
        const storedSubmission = sessionStorage.getItem('lastSubmission');
        if (storedSubmission) {
            setLastSubmission(JSON.parse(storedSubmission));
        }
    }, []);

    const handleSubmission = (submission: any) => {
        sessionStorage.setItem('lastSubmission', JSON.stringify(submission));
        setLastSubmission(submission);
    };

    return (
        <div>
            <h1>Student Assignment Submission</h1>
            <StudentForm onSubmit={handleSubmission} />
            {lastSubmission && (
                <div>
                    <h2>Last Submission</h2>
                    <p>Name: {lastSubmission.name}</p>
                    <p>Neptun Code: {lastSubmission.neptunCode}</p>
                    <p>Assignment: {lastSubmission.assignment}</p>
                    <p>File: {lastSubmission.fileName}</p>
                </div>
            )}
        </div>
    );
};

export default StudentPage;