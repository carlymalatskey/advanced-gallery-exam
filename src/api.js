import axios from "axios";

const baseUrl = "http://localhost:5000";
const axiosWithOptions = axios.create({
    withCredentials: true
})

const api = {
    user: {
        setName: (name) => {
            return axiosWithOptions.post(`${baseUrl}/name`, {name});
        },
    },
    analytics: {
        logAction: (type, message) => {
            return axiosWithOptions.post(`${baseUrl}/user-event`, {type, message})
        }
    }
};

export default api;