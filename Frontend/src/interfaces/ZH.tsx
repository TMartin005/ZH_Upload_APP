export interface StudentSubmission {
    studentName: string;
    neptunCode: string;
    assignmentName: string;
    selfAuthored: boolean;
    aiAcknowledgment: boolean;
    mainFile: File; // .c or .cpp file
    optionalFile?: File; // Optional .csv file
}

export interface Assignment {
    name: string;
    folder: string; // Folder where submissions for this assignment are stored
}

export interface SubmissionRecord {
    submissionId: string; // Unique identifier for the submission
    submissionDate: Date; // Date of submission
    files: {
        mainFile: string; // Path to the main file
        optionalFile?: string; // Path to the optional file, if any
    };
}