import { createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "./dashboardService";
import { IGlobalState } from "@/types/globalState";
import {
	IContactAndLeadStat,
	IContactByRegion,
	IRecentlyCreatedCustomer,
	IRecentlyCreatedLead,
	ITotalStat,
	ITotalsByData,
} from "./dashboardTypes";

const contactsByRegion: IGlobalState<IContactByRegion[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const recentlyCreatedLeads: IGlobalState<IRecentlyCreatedLead[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const recentlyCreatedCustomers: IGlobalState<IRecentlyCreatedCustomer[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const totalsBy: IGlobalState<ITotalsByData[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const contactAndLeadStats: IGlobalState<IContactAndLeadStat[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const totalStats: IGlobalState<ITotalStat> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};

const initialState = {
	recentlyCreatedCustomers,
	recentlyCreatedLeads,
	contactAndLeadStats,
	contactsByRegion,
	totalStats,
	totalsBy,
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		resetStoreAuth: () => {},
	},
	extraReducers: (builder) => {
		builder
			//getTotalStats
			.addCase(dashboardService.getTotalStats.pending, (state) => {
				state.totalStats.isSuccess = false;
				state.totalStats.isLoading = true;
				state.totalStats.isError = false;
			})
			.addCase(dashboardService.getTotalStats.fulfilled, (state, action) => {
				state.totalStats.isLoading = false;
				state.totalStats.isSuccess = true;
				state.totalStats.isError = false;
				state.totalStats.data = action.payload;
			})
			.addCase(dashboardService.getTotalStats.rejected, (state) => {
				state.totalStats.isLoading = false;
				state.totalStats.isSuccess = false;
				state.totalStats.isError = true;
				state.totalStats.data = null;
			})
			//getContactsByRegion
			.addCase(dashboardService.getContactsByRegion.pending, (state) => {
				state.contactsByRegion.isSuccess = false;
				state.contactsByRegion.isLoading = true;
				state.contactsByRegion.isError = false;
			})
			.addCase(
				dashboardService.getContactsByRegion.fulfilled,
				(state, action) => {
					state.contactsByRegion.isLoading = false;
					state.contactsByRegion.isSuccess = true;
					state.contactsByRegion.isError = false;
					state.contactsByRegion.data = action.payload;
				}
			)
			.addCase(dashboardService.getContactsByRegion.rejected, (state) => {
				state.contactsByRegion.isLoading = false;
				state.contactsByRegion.isSuccess = false;
				state.contactsByRegion.isError = true;
				state.contactsByRegion.data = null;
			})
			//getRecentlyCreatedLeads
			.addCase(dashboardService.getRecentlyCreatedLeads.pending, (state) => {
				state.recentlyCreatedLeads.isSuccess = false;
				state.recentlyCreatedLeads.isLoading = true;
				state.recentlyCreatedLeads.isError = false;
			})
			.addCase(
				dashboardService.getRecentlyCreatedLeads.fulfilled,
				(state, action) => {
					state.recentlyCreatedLeads.isLoading = false;
					state.recentlyCreatedLeads.isSuccess = true;
					state.recentlyCreatedLeads.isError = false;
					state.recentlyCreatedLeads.data = action.payload;
				}
			)
			.addCase(dashboardService.getRecentlyCreatedLeads.rejected, (state) => {
				state.recentlyCreatedLeads.isLoading = false;
				state.recentlyCreatedLeads.isSuccess = false;
				state.recentlyCreatedLeads.isError = true;
				state.recentlyCreatedLeads.data = null;
			})
			//getTotalsBy
			.addCase(dashboardService.getTotalsBy.pending, (state) => {
				state.totalsBy.isSuccess = false;
				state.totalsBy.isLoading = true;
				state.totalsBy.isError = false;
			})
			.addCase(dashboardService.getTotalsBy.fulfilled, (state, action) => {
				state.totalsBy.isLoading = false;
				state.totalsBy.isSuccess = true;
				state.totalsBy.isError = false;
				state.totalsBy.data = action.payload;
			})
			.addCase(dashboardService.getTotalsBy.rejected, (state) => {
				state.totalsBy.isLoading = false;
				state.totalsBy.isSuccess = false;
				state.totalsBy.isError = true;
				state.totalsBy.data = null;
			})
			//getContactAndLeadStats
			.addCase(dashboardService.getContactAndLeadStats.pending, (state) => {
				state.contactAndLeadStats.isSuccess = false;
				state.contactAndLeadStats.isLoading = true;
				state.contactAndLeadStats.isError = false;
			})
			.addCase(
				dashboardService.getContactAndLeadStats.fulfilled,
				(state, action) => {
					state.contactAndLeadStats.isLoading = false;
					state.contactAndLeadStats.isSuccess = true;
					state.contactAndLeadStats.isError = false;
					state.contactAndLeadStats.data = action.payload;
				}
			)
			.addCase(dashboardService.getContactAndLeadStats.rejected, (state) => {
				state.contactAndLeadStats.isLoading = false;
				state.contactAndLeadStats.isSuccess = false;
				state.contactAndLeadStats.isError = true;
				state.contactAndLeadStats.data = null;
			})
			//getRecentlyCreatedCustomers
			.addCase(
				dashboardService.getRecentlyCreatedCustomers.pending,
				(state) => {
					state.recentlyCreatedCustomers.isSuccess = false;
					state.recentlyCreatedCustomers.isLoading = true;
					state.recentlyCreatedCustomers.isError = false;
				}
			)
			.addCase(
				dashboardService.getRecentlyCreatedCustomers.fulfilled,
				(state, action) => {
					state.recentlyCreatedCustomers.isLoading = false;
					state.recentlyCreatedCustomers.isSuccess = true;
					state.recentlyCreatedCustomers.isError = false;
					state.recentlyCreatedCustomers.data = action.payload;
				}
			)
			.addCase(
				dashboardService.getRecentlyCreatedCustomers.rejected,
				(state) => {
					state.recentlyCreatedCustomers.isLoading = false;
					state.recentlyCreatedCustomers.isSuccess = false;
					state.recentlyCreatedCustomers.isError = true;
					state.recentlyCreatedCustomers.data = null;
				}
			);
	},
});

export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;
