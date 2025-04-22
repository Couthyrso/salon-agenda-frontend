import Cookies from 'js-cookie';

export const TOKEN_KEY = Cookies.get('token');
export const isAuthenticated = () => Cookies.get('token') !== null;
export const getToken = () => Cookies.get('token');