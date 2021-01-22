import axios from "axios";

const baseUrl = "";
const axiosWithOptions = axios.create({
    withCredentials: true, 
})

const api = {
    user: {
        setName: (name) => {
            return axiosWithOptions.post(`${baseUrl}/name`, {name});
        },
    },
    analytics: {
        logAction: (type, message, details) => {
            return axiosWithOptions.post(`${baseUrl}/user-event`, {type, message, details})
        }
    },
    search: {
        getItems: (tag, page) => {
            const perPage = 20;
            return axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&page=${page}`)
        }

    }
};

export default api;