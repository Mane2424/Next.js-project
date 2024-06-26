import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/accountSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
export const store = configureStore({
	reducer: {
		account: accountReducer,
		dashboard: dashboardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
