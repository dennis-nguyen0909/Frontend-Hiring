import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;
export default function requestApi(endpoint,method,body,responseType='json'){
    const headers = {
        "Accept":"application/json",
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"*",
    }
    const instance = axios.create({headers})

    instance.interceptors.request.use((config)=>{
        const token = localStorage.getItem("access_token");
        if(token){
            config.headers['Authorization']= `Bearer ${token}`;
        }
        return config;
    },(error)=>{
        return Promise.reject(error)
    })  

    instance.interceptors.response.use((response)=>{
        return response;
    },async (error)=>{
        const originConfig = error.config;
        if(error.response && +error.response.data.status === 419){
            try {
                console.log("call api refresh token");
                const res = await instance.post(`${apiUrl}/auth/refresh-token`,{
                    refresh_token:localStorage.getItem('refresh_token')
                })
                if(res.data.data && res.data.data.user){
                   const {refresh_token,access_token}=res.data.data.user;
                   localStorage.setItem('access_token',access_token)
                   localStorage.setItem('refresh_token',refresh_token)
                   originConfig.headers['Authorization']=`Bearer ${access_token}`
                   return  instance(originConfig);
                }
            } catch (error) {
                if(error.response && error.response.status === 400){
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href='/login';
                }
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    })

    return instance.request({
        method:method,
        url:`${apiUrl}${endpoint}`,
        data:body,
        responseType:responseType

    })
}