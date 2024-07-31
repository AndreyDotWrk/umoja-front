import axios from 'axios'
import { useUserStore } from '~/stores/userStore';


export const useApi = (transformResponse) => {
    const token = useUserStore().userToken;
    const config = useRuntimeConfig();
    const baseURL = config.public.backendApiUrl;

    const instance = axios.create({
        baseURL,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        },
        transformResponse: transformResponse ? [transformResponse] : axios.defaults.transformResponse
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401) {
                // Redirect to login page
                const sessionExpiredEvent = new Event('userSessionExpired');
                window.dispatchEvent(sessionExpiredEvent);
            }
            return Promise.reject(error);
        }
    );



    return instance;
};