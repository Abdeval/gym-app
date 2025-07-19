import axios from "axios";
import * as SecureStore from 'expo-secure-store';



const api = axios.create({
    baseURL: `https://gym-app-ucv2.onrender.com/api`,
});

const auth = axios.create({
    baseURL: `https://gym-app-ucv2.onrender.com/api/auth`,
});


// ! Request interceptor

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('session');
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