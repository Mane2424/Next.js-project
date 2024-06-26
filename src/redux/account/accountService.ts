import apiClient from "@/config/api-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PipelineType } from "./accountTypes";

const getUser = createAsyncThunk("/tenant/user", async (payload, thunkAPI) => {
	try {
		const response = await apiClient.get(
			"/api/services/Platform/Session/GetCurrentLoginInformations"
		);
		return thunkAPI.fulfillWithValue(response.data.result);
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});
const getPipelines = createAsyncThunk(
	"/AbpUserConfiguration/GetAll",
	async (payload, thunkAPI) => {
		try {
			const response = await apiClient.get(
				"/api/services/CRM/Pipeline/GetPipelineDefinitions"
			);
			const pipelines = (response.data.result ?? []).filter(
				(item: PipelineType) => item.purposeId === "L"
			);
			return thunkAPI.fulfillWithValue(pipelines);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const updateAffiliateCode = createAsyncThunk(
	"api/services/CRM/MemberSettings/UpdateAffiliateCode",
	async (payload: { affiliateCode: string }, thunkAPI) => {
		try {
			const response = await apiClient.put(
				"/api/services/CRM/MemberSettings/UpdateAffiliateCode",
				payload
			);
			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
export const accountService = {
	updateAffiliateCode,
	getPipelines,
	getUser,
};
