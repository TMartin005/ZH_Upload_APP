import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
const StudentPage: React.FC = () => {
 

    return (
    <div className="center-container">
      <h1>ZH feltöltés</h1>
        <div className="form-container">
          <StudentForm />
        </div>
      </div>

  );
};

export default StudentPage;