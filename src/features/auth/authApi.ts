import { AUTH_URLS } from "./authUrls";
import { type loginFacebookRequest, type loginGoogleRequest, type logoutRequest, type RefreshTokenRequest } from "../../types/auth";
import axiosClient from "../../api/axiosClient";

export const authApi = {
  googleLogin: ({ idToken }: loginGoogleRequest) =>
    axiosClient.post(AUTH_URLS.GOOGLE_LOGIN, { idToken }),
  logout: ({ refreshToken }: logoutRequest) => axiosClient.post(AUTH_URLS.LOGOUT, { refreshToken }),
  refresh: ({ accessToken, refreshToken }: RefreshTokenRequest) =>
    axiosClient.post(AUTH_URLS.REFRESH_TOKEN, { accessToken, refreshToken }),
  facebookLogin: ({ accessToken }: loginFacebookRequest) =>
    axiosClient.post(AUTH_URLS.FACEBOOK_LOGIN, { accessToken }),
};