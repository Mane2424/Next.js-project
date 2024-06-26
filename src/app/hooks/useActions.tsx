import { bindActionCreators } from "@reduxjs/toolkit";

import { accountService } from "@/redux/account/accountService";
import { accountActions } from "@/redux/account/accountSlice";
import { dashboardService } from "@/redux/dashboard/dashboardService";
import { dashboardActions } from "@/redux/dashboard/dashboardSlice";

import { useAppDispatch } from "@/redux";

const actions = {
	...accountService,
	...accountActions,
	...dashboardService,
	...dashboardActions,
};

export const useActions = () => {
	const dispatch = useAppDispatch();

	return bindActionCreators(actions, dispatch);
};
