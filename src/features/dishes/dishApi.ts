import axiosClient from "../../api/axiosClient";
import { DISH_URLS } from "./dishUrls";

interface GetDishesParams {
  pageIndex?: number;
  pageSize?: number;
}

export const dishApi = {
  getDishes: (params: GetDishesParams) =>
    axiosClient.get(DISH_URLS.GET_DISHES, { params }),

  deleteDish: (id: string) => axiosClient.delete(DISH_URLS.DELETE_DISH(id)),

  createDish: (formData: FormData) =>
    axiosClient.post(DISH_URLS.CREATE_DISH, formData),

  updateDish: (id: string, formData: FormData) =>
    axiosClient.put(DISH_URLS.UPDATE_DISH, formData, {
      params: { Id: id },
    }),
};
