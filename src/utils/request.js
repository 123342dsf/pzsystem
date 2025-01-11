import axios from 'axios'
const http = axios.create({
    baseURL: 'https:/v3pz.itndedu.com/v3pz',
    timeout:10000,
    headers: {
        "terminal":"h5"
    }
})
//添加拦截器
// 添加请求拦截器,参数config是请求（在这里是添加前缀）
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么,
    //localStorage是一个 Web API，允许你在用户的浏览器中存储数据
    //getItem() 方法用于从本地存储中获取指定 key(pz_token) 对应的值。
    const token=localStorage.getItem('h5_token')
    //不需要添加token的api
    const whiteUrl=['/login']
    if(token && !whiteUrl.includes(config.url)){
        config.headers['h-token']=token
        }    
    return config;
    }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
    });

// 添加响应拦截器，参数response是响应（在这里是对某些错误进行处理）
http.interceptors.response.use(function (response) {
    // 对响应错误做点什么
    //代表token有问题（过期等），则清除token和用户信息,并且跳转页面
    if(response.data.code===-2){
        localStorage.removeItem('h5_token')
        localStorage.removeItem('h5_userInfo')
        window.location.href=window.location.origin
    }
    return response;
    }, function (error) {
    return Promise.reject(error);
    });

export default http