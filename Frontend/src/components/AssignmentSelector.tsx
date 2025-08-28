import React from 'react';

interface AssignmentSelectorProps {
    assignments: string[];
    selectedAssignment: string;
    onAssignmentChange: (assignment: string) => void;
}

const AssignmentSelector: React.FC<AssignmentSelectorProps> = ({ assignments, selectedAssignment, onAssignmentChange }) => {
    return (
        <div>
            <label htmlFor="assignment-select">Select Assignment:</label>
            <select
                id="assignment-select"
                value={selectedAssignment}
                onChange={(e) => onAssignmentChange(e.target.value)}
            >
                {assignments.map((assignment, index) => (
                    <option key={index} value={assignment}>
                        {assignment}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AssignmentSelector;