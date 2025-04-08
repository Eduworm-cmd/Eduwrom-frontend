import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

const PostApi = async (url, method, data, headers) => {
    try {
        const response = await axios({
            url: `${BASE_URL}${url}`,
            method: method,
            data,
            headers
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export default PostApi;