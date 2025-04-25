import axios from "axios";


//creating axios api instance
const api = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    headers : {
        "Content-Type" : 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
})




export default api
