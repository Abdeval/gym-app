import axios from "axios";
import * as SecureStore from 'expo-secure-store';



const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
});

const auth = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
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