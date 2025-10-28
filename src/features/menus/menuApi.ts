import axiosClient from "../../api/axiosClient";
import { MENU_URLS } from "./menuUrls";

interface GetMenusParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

interface AddMenuDayData {
  dayNumber: number;
}

interface AddMealData {
  mealType: string;
  isMainMeal: boolean;
  dishIds: string[];
}

export const menuApi = {
  getMenus: (params: GetMenusParams) =>
    axiosClient.get(MENU_URLS.GET_MENUS, { params }),

  createMenu: (formData: FormData) =>
    axiosClient.post(MENU_URLS.CREATE_MENU, formData),

  addMenuDay: (menuId: string, data: AddMenuDayData) =>
    axiosClient.post(MENU_URLS.ADD_MENU_DAY(menuId), data),

  addMeal: (menuId: string, dayNumber: number, data: AddMealData) =>
    axiosClient.post(MENU_URLS.ADD_MEAL(menuId, dayNumber), data),
};
