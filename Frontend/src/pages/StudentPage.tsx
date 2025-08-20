import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import "./StudentPage.css";
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
    <div className="center-container">
      <h1>ZH feltöltés</h1>
        <div className="form-container">
          <StudentForm onSubmit={handleSubmission} />
        </div>
        {lastSubmission && (
          <div>
            <h2>Utolsó beadás</h2>
            <p>Név: {lastSubmission.name}</p>
            <p>Neptun Code: {lastSubmission.neptunCode}</p>
            <p>Assignment: {lastSubmission.assignment}</p>
            <p>Files: {lastSubmission.fileName}</p>
          </div>
        )}
      </div>

  );
};

export default StudentPage;