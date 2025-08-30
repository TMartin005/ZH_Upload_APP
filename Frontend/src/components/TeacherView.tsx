import React, { useEffect, useState } from "react";
import type { StudentSubmission } from "../interfaces/ZH";
const TeacherView: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const host = import.meta.env.VITE_SERVER;
  const port = import.meta.env.VITE_PORT;

  useEffect(() => {
    fetch(`http://${host}:${port}/api/teachers/submissions`)
      .then((res) => res.json())
      .then((data) => {
        // Flatten submissions for easier rendering
        const flat = Object.entries(data).flatMap(([assignment, files]) =>
          (Array.isArray(files) ? files : []).map((sub) => ({
            ...sub,
            assignmentName: assignment,
          }))
        );
        setSubmissions(flat);
      });
  }, []);

  return (
    <div>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {submissions.map((submission, index) => (
            <li key={index}>
              <strong>Name:</strong> {submission.studentName} <br />
              <strong>Neptun Code:</strong> {submission.neptunCode} <br />
              <strong>Assignment:</strong> {submission.assignmentName} <br />
              <strong>File: </strong>
              <a
                href={`http://${host}:${port}/${submission.assignmentName}/${submission.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {submission.fileName} <br />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherView;
