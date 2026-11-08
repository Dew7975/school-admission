import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Get all submissions
export const getSubmissions = async () => {
    const response = await api.get('submissions/');
    return response.data;
};

// Get summary statistics (Total, Pending, Accepted, Rejected)
export const getSummary = async () => {
    const response = await api.get('submissions/summary/');
    return response.data;
};

// Create new submission (Multipart form data for images & documents)
export const createSubmission = async (formData) => {
    const response = await api.post('submissions/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};