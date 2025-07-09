import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://192.168.90.126:4000/api',
});

const auth = axios.create({
    baseURL: 'http://192.168.90.126:4000/api/auth',
});


// ! Request interceptor

api.interceptors.request.use(
    (config) => {
        const token = SecureStore.getItem('session');
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error: any) => {
        return Promise.reject(error)
    }
);

export { api, auth };