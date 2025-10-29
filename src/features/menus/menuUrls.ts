export const MENU_URLS = {
  GET_MENUS: "/menus",
  CREATE_MENU: "/menus",

  ADD_MENU_DAY: (menuId: string) => `/menus/${menuId}/days`,

  ADD_MEAL: (menuId: string, dayNumber: number) =>
    `/menus/${menuId}/days/${dayNumber}/meals`,
};
