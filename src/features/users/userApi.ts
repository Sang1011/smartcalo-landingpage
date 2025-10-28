import axiosClient from "../../api/axiosClient";
import { USER_URLS } from "./userUrls";

interface GetUsersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export const userApi = {
  getUsers: (params: GetUsersParams) =>
    axiosClient.get(USER_URLS.GET_USERS, { params }),

  deleteUser: (id: string) => axiosClient.delete(USER_URLS.DELETE_USER(id)),
};
