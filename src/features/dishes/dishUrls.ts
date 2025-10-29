export const DISH_URLS = {
  GET_DISHES: "/dishs", //BE đặt sai tên

  CREATE_DISH: "/dishes",

  UPDATE_DISH: "/dishes",

  DELETE_DISH: (id: string) => `/dishes/${id}`,
};
