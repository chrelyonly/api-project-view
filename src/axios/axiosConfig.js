/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
const {ElMessage} = () => import('element-plus');
// import {ElMessage} from "element-plus";
const baseURL = import.meta.env.VITE_APP_API;
/**
 * 创建一个新的 Axios 实例
 * @param {object} config - 自定义配置对象
 * @returns {object} - Axios 实例
 */
const createAxiosInstance = (config = {}) => {
    const defaultConfig = {
        timeout: 30000, // 请求超时时间
        validateStatus: status => status >= 200 && status <= 500, // 默认的状态码验证
        withCredentials: true, // 允许跨域携带凭证
        baseURL: baseURL,
    };

    // 合并默认配置与传入配置
    const instance = axios.create({ ...defaultConfig, ...config });

    /**
     * 请求拦截器
     */
    instance.interceptors.request.use(
        requestConfig => {
            // 请求发送前的逻辑
            console.log('发起请求:', {
                url: requestConfig.url,
                method: requestConfig.method,
                headers: requestConfig.headers,
                params: requestConfig.params,
                data: requestConfig.data,
            });
            return requestConfig;
        },
        error => {
            // 捕获请求阶段的错误
            console.error('请求拦截器错误:', {
                url: error?.config?.url,
                method: error?.config?.method,
                headers: error?.config?.headers,
                params: error?.config?.params,
                data: error?.config?.data,
                message: error.message,
            });
            return Promise.reject(error);
        }
    );

    /**
     * 响应拦截器
     */
    instance.interceptors.response.use(
        response => {
            const { status, data, config: resConfig } = response;

            if (status !== 200) {
                ElMessage.error("网络开小差了哦~")
                // 打印非 200 响应日志
                console.warn(`响应错误: ${status}`, data, {
                    url: resConfig.url,
                    method: resConfig.method,
                    headers: resConfig.headers,
                    params: resConfig.params,
                    data: resConfig.data,
                });
                return Promise.reject(new Error(data?.message || '未知错误'));
            }

            // 返回响应数据
            return response;
        },
        error => {
            // 捕获响应阶段的错误
            console.error('响应拦截器错误:', {
                url: error?.config?.url,
                method: error?.config?.method,
                headers: error?.config?.headers,
                params: error?.config?.params,
                data: error?.config?.data,
                message: error.message,
            });
            return Promise.reject(new Error(error.message || '网络错误'));
        }
    );

    return instance;
};

export default createAxiosInstance();
