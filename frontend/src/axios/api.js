import { ACCESS_TOKEN, BASE_URL } from "@/utils/constants/constants";
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




export default api
