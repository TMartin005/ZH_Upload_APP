import React, { useEffect, useState } from 'react';
import TeacherView from '../components/TeacherView';
import "../pages/TeacherPage.css";
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
           
            <TeacherView submissions={submissions} />
        </div>
    );
};

export default TeacherPage;