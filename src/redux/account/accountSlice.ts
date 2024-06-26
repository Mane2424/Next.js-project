import { createSlice } from "@reduxjs/toolkit";
import { PipelineType } from "./accountTypes";
import { accountService } from "./accountService";
import { IGlobalState } from "@/types/globalState";

const account: IGlobalState<any> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const permissions: IGlobalState<any> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: null,
};
const pipeLines: IGlobalState<PipelineType[]> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: [],
};
const updateAffiliateCode: IGlobalState<string> = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	data: "",
};

const initialState = {
	updateAffiliateCode,
	account,
	permissions,
	pipeLines,
};

const accountSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		resetStoreAuth: () => {},
	},
	extraReducers: (builder) => {
		builder
			.addCase(accountService.getUser.pending, (state) => {
				state.account.isSuccess = false;
				state.account.isLoading = true;
				state.account.isError = false;
			})
			.addCase(accountService.getUser.fulfilled, (state, action) => {
				state.account.isLoading = false;
				state.account.isSuccess = true;
				state.account.isError = false;
				state.account.data = action.payload;
			})
			.addCase(accountService.getUser.rejected, (state) => {
				state.account.isLoading = false;
				state.account.isSuccess = false;
				state.account.isError = true;
				state.account.data = null;
			})
			.addCase(accountService.getPipelines.pending, (state) => {
				state.pipeLines.isSuccess = false;
				state.pipeLines.isLoading = true;
				state.pipeLines.isError = false;
			})
			.addCase(accountService.getPipelines.fulfilled, (state, action) => {
				state.pipeLines.isLoading = false;
				state.pipeLines.isSuccess = true;
				state.pipeLines.isError = false;
				state.pipeLines.data = action.payload;
			})
			.addCase(accountService.getPipelines.rejected, (state) => {
				state.pipeLines.isLoading = false;
				state.pipeLines.isSuccess = false;
				state.pipeLines.isError = true;
				state.pipeLines.data = null;
			})
			.addCase(accountService.updateAffiliateCode.pending, (state) => {
				state.updateAffiliateCode.isSuccess = false;
				state.updateAffiliateCode.isLoading = true;
				state.updateAffiliateCode.isError = false;
			})
			.addCase(accountService.updateAffiliateCode.fulfilled, (state) => {
				state.updateAffiliateCode.isLoading = false;
				state.updateAffiliateCode.isSuccess = true;
				state.updateAffiliateCode.isError = false;
				state.updateAffiliateCode.data = "";
			})
			.addCase(accountService.updateAffiliateCode.rejected, (state) => {
				state.updateAffiliateCode.isLoading = false;
				state.updateAffiliateCode.isSuccess = false;
				state.updateAffiliateCode.isError = true;
				state.updateAffiliateCode.data = null;
			});
	},
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
