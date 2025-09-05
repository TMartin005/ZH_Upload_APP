import React, { useState } from 'react';
import TeacherView from '../components/TeacherForm';
import "../pages/TeacherPage.css";

const TeacherPage: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [input, setInput] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/api/auth/login', {
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
                <h2>Tanári oldal jelszóval védett</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Jelszó"
                        style={{ padding: "10px", fontSize: "1rem", borderRadius: "6px", border: "1.5px solid #1976d2" }}
                    />
                    <button type="submit" style={{ marginLeft: "12px" }}>Belépés</button>
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