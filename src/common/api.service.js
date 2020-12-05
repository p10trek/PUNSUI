import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/jwt.service";
import router from "@/router";

const ApiService = {
    init() {
        Vue.use(VueAxios, axios);
        Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
        this.setRequestInterceptor();
        this.setResponseInterceptor();
    },

    setRequestInterceptor() {
        Vue.axios.interceptors.request.use(
            config => {
                const accessToken = JwtService.getAccessToken();
                if (accessToken) {
                    config.headers.Authorization = "Bearer " + accessToken;
                }
                return config;
            },
            error => {
                Promise.reject(error).then(error => console.log(error));
                JwtService.destroyAccessToken()
                JwtService.destroyRefreshToken()
            }
        );
    },

    setResponseInterceptor() {
        Vue.axios.interceptors.response.use(

            response => response,

            async error => {
                let errorResponse = error.response;

                if (!errorResponse) {
                    await router.push({
                        name: "login"
                    });

                    errorResponse = {
                        data: {
                            success: false,
                            message: "Connection error"
                        }
                    };

                } else if (error.response.status === 401 || error.response.status === 403) {

                    const response = this.post( "Authentication/RefreshToken", {
                        refreshToken: JwtService.getRefreshToken()
                    });

                    if (response.success) {
                        JwtService.saveAccessToken(response.data.accessToken)
                        JwtService.saveAccessToken(response.data.refreshToken)

                        // store.dispatch("setSession", {
                        //     accessToken: response.data.accessToken,
                        //     refreshToken: response.data.refreshToken
                        // });

                        const result = await axios.request(error.config);
                        return result;
                    }

                    await router.push({
                        name: "Login"
                    });

                } else if (error.response === 400) {
                    JwtService.destroyAccessToken()
                    JwtService.destroyRefreshToken()
                    // store.dispatch("removeSession");
                    await router.push({
                        name: "login"
                    });
                }

                return Promise.reject(errorResponse);
            }
        );
    },

    query(resource, params) {
        return Vue.axios.get(resource, params).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    get(resource, slug = "") {
        return Vue.axios.get(`${resource}/${slug}`).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    post(resource, params) {
        return Vue.axios.post(`${resource}`, params);
    },

    update(resource, slug, params) {
        return Vue.axios.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        return Vue.axios.put(`${resource}`, params);
    },

    delete(resource) {
        return Vue.axios.delete(resource).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    }
};

export default ApiService;
