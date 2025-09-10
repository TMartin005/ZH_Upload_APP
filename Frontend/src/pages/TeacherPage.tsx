import React, { useState } from 'react';
import TeacherView from '../components/TeacherForm';
import "../pages/TeacherPage.css";

const TeacherPage: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [input, setInput] = useState("");
    const host = import.meta.env.VITE_SERVER_IP;
    const port = import.meta.env.VITE_PORT;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`http://${host}:${port}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: input }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            setAuthenticated(true);
        } else {
            alert("Hibás jelszó!");
        }
    };

    if (!authenticated) {
        return (
            <div className="teacher-auth-container">
                <h2>Tanári oldal jelszóval védett</h2>
                <form onSubmit={handleSubmit} className="teacher-auth-form">
                    <input
                        type="password"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Jelszó"
                        className="teacher-auth-input"
                    />
                    <button type="submit" className="teacher-auth-button">Belépés</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <TeacherView />
        </div>
    );
};

export default TeacherPage;