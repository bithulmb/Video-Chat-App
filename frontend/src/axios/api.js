import { ACCESS_TOKEN, BASE_URL, REFRESH_TOKEN } from "@/utils/constants/constants";
import axios from "axios";


//creating axios api instance
const api = axios.create({
    baseURL : BASE_URL,
    headers : {
        "Content-Type" : 'application/json',
        'Accept': 'application/json',
    },
})


//modifying requests using axios interceptors by adding access token in headers
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN)

        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
          ) {

            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem(REFRESH_TOKEN)

                if (!refresh) {
                    throw new Error("No refresh token available")
                }

                const response = await axios.post(`${BASE_URL}/api/token/refresh/`,{refresh})

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                console.log("access token refreshed")
                localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                localStorage.setItem(REFRESH_TOKEN,newRefreshToken);
              
                return api(originalRequest);

            }  catch (refreshError) {
                console.error("Refresh token expired. Please login again.");
                
                window.location.href = "/login"; 
              }
          }
          
          return Promise.reject(error);
    }
)




export default api
