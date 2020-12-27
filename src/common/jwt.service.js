import VueCookies from "vue-cookies"

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () => {
    return VueCookies.get(ACCESS_TOKEN_KEY);
};

export const saveAccessToken = token => {
    let date = new Date()
    date.setMinutes(date.getMinutes() + 15 )
    VueCookies.set(ACCESS_TOKEN_KEY, token, date);
};

export const destroyAccessToken = () => {
    VueCookies.remove(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
    return VueCookies.get(REFRESH_TOKEN_KEY);
};

export const saveRefreshToken = token => {
    let date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    VueCookies.set(REFRESH_TOKEN_KEY, token, date);
    VueCookies.set(REFRESH_TOKEN_KEY, token);
};

export const destroyRefreshToken = () => {
    VueCookies.remove(REFRESH_TOKEN_KEY);
};

export default { getAccessToken, saveAccessToken, destroyAccessToken,
    getRefreshToken, saveRefreshToken, destroyRefreshToken };