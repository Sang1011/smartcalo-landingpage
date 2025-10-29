import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import userReducer from "../features/users/userSlice";
import dishReducer from "../features/dishes/dishSlice";
import exerciseReducer from "../features/exercises/exerciseSlice";
import menuReducer from "../features/menus/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    dish: dishReducer,
    exercise: exerciseReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
