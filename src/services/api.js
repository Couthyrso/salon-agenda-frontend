import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: 'https://salon-agenda-backend-production.up.railway.app/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Requisição com token:", {
            url: config.url,
            method: config.method,
            headers: config.headers
        });
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para respostas
api.interceptors.response.use(
    (response) => {
        console.log("Resposta da API:", {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error("Erro na requisição:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;