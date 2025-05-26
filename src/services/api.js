import axios from 'axios';
import Cookies from 'js-cookie';
import { decryptToken } from '../helpers/cryptoHelpers';

const api = axios.create({
    baseURL: 'http://salon-agenda-backend.test:8080/',
    withCredentials: true,
    withXSRFToken: false,
});

api.interceptors.request.use((config) => {
    const encryptedToken = Cookies.get('token');

    if (encryptedToken) {
        const token = decryptToken(encryptedToken);
        if (!token) {
            Cookies.remove('token');
            window.location.href = '/auth/sign-in';
            return Promise.reject('Token inválido');
        }
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {

            window.location.href = 'auth/sign-in';
        }
        return Promise.reject(error);
    }
);

export default api;