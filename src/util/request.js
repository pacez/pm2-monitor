import axios from 'axios';
import Immutable from 'immutable';
import { message } from 'antd';
import { defaultErrorMsg } from './constants';

const instance = axios.create({
    // baseURL: '//10.99.110.115:9000',
    // baseURL: '//localhost:9000',
    // baseURL:'//monitor.elearning.com',
    timeout: 10000,
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // console.log(response)
    const data = response.data;
    return typeof data === 'string' ? data : Immutable.fromJS(data);
}, function (e) {
    console.log(e);
    try {   
        const  { response={} } = e;
        console.log(response)
        const { status } = response;
        if(status===401) {
            window.location.href = '/login';
        }
        return 
    }catch(e) {
        console.log(e);
    }
    message.error(defaultErrorMsg.system);
    return Promise.reject(e);
});


export default instance 