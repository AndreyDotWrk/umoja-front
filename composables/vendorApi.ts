import axios from 'axios';
import { useRouter } from 'vue-router';
import { useVendorStore } from '~/stores/vendorStore';


export const vendorUseApi = (transformResponse) => {
    
    const token = useVendorStore().vendorToken;
    const config = useRuntimeConfig()
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
                const sessionExpiredEvent = new Event('sessionExpired');
                window.dispatchEvent(sessionExpiredEvent);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};
