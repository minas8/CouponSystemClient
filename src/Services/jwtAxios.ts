import axios from "axios";
import store from "../Redux/Store";

const jwtAxios = axios.create();

// Request interceptor
jwtAxios.interceptors.request.use(request => {
    request.headers = {
        "token": store.getState().authState.user?.token
    }
    
    return request;
});

export default jwtAxios;