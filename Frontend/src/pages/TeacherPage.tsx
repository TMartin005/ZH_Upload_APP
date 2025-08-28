import React, { useEffect, useState } from 'react';
import TeacherView from '../components/TeacherView';

const TeacherPage: React.FC = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        // Fetch submissions from local storage or a local folder
        const fetchSubmissions = () => {
            const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            setSubmissions(storedSubmissions);
        };

        fetchSubmissions();
    }, []);

    return (
        <div>
            <h1>Student Submissions</h1>
            <TeacherView submissions={submissions} />
        </div>
    );
};

export default TeacherPage;