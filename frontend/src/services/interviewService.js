import api from "./api";

// Get HR Questions
export const getHRQuestions = async (difficulty, count = 5) => {
  try {
    const response = await api.get(`/questions/hr/${difficulty}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching HR questions:", error);
    return [];
  }
};

// Get Technical Questions
export const getTechnicalQuestions = async (category, difficulty, count = 5) => {
  try {
    const response = await api.get(`/questions/technical/${encodeURIComponent(category)}/${difficulty}?count=${count}`);
    return response.data?.questions || response.data;
  } catch (error) {
    console.error("Error fetching Technical questions:", error);
    return [];
  }
};

// Get Aptitude Questions
export const getAptitudeQuestions = async (category, difficulty, count = 10) => {
  try {
    const response = await api.get(`/questions/aptitude/${encodeURIComponent(category)}/${difficulty}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Aptitude questions:", error);
    throw error;
  }
};

// Get Communication Questions
export const getCommunicationQuestions = async (category, difficulty, count = 5) => {
  try {
    const response = await api.get(`/questions/communication/${encodeURIComponent(category)}/${difficulty}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Communication questions:", error);
    throw error;
  }
};

// Get Resume Questions
export const getResumeQuestions = async (config) => {
  try {
    const response = await api.post(`/questions/resume`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching Resume questions:", error);
    throw error;
  }
};

// Save Interview
export const saveInterview = async (data) => {
  try {
    const response = await api.post("/interview/save", data);
    return response.data;
  } catch (error) {
    console.error("Error saving interview:", error);
    throw error;
  }
};

// Get User Interviews
export const getInterviews = async () => {
  try {
    const response = await api.get("/interview");
    return response.data;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw error;
  }
};

// Get Single Interview Details
export const getInterviewDetails = async (id) => {
  try {
    const response = await api.get(`/interview/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interview details:", error);
    throw error;
  }
};