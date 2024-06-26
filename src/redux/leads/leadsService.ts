// import apiClient from "@/config/api-client";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// const getTotalStats = createAsyncThunk(
// 	"/api/services/CRM/Dashboard/GetTotals",
// 	async (
// 		payload: {
// 			contactGroupId?: string | undefined;
// 			startDate?: string | undefined;
// 			endDate?: string | undefined;
// 			sourceContactId?: number | undefined;
// 			sourceOrganizationUnitIds?: number[] | undefined;
// 		},
// 		thunkAPI
// 	) => {
// 		let url = "/api/services/CRM/Dashboard/GetTotals?";
// 		if (payload.startDate === null)
// 			throw new Error("The parameter 'startDate' cannot be null.");
// 		else if (payload.startDate !== undefined)
// 			url +=
// 				"StartDate=" +
// 				encodeURIComponent(payload.startDate ? "" + payload.startDate : "") +
// 				"&";
// 		if (payload.endDate === null)
// 			throw new Error("The parameter 'endDate' cannot be null.");
// 		else if (payload.endDate !== undefined)
// 			url +=
// 				"EndDate=" +
// 				encodeURIComponent(payload.endDate ? "" + payload.endDate : "") +
// 				"&";
// 		if (payload.contactGroupId === null)
// 			throw new Error("The parameter 'contactGroupId' cannot be null.");
// 		else if (payload.contactGroupId !== undefined)
// 			url +=
// 				"ContactGroupId=" +
// 				encodeURIComponent("" + payload.contactGroupId) +
// 				"&";
// 		if (payload.sourceContactId === null)
// 			throw new Error("The parameter 'sourceContactId' cannot be null.");
// 		else if (payload.sourceContactId !== undefined)
// 			url +=
// 				"SourceContactId=" +
// 				encodeURIComponent("" + payload.sourceContactId) +
// 				"&";
// 		if (payload.sourceOrganizationUnitIds === null)
// 			throw new Error(
// 				"The parameter 'sourceOrganizationUnitIds' cannot be null."
// 			);
// 		else if (payload.sourceOrganizationUnitIds !== undefined)
// 			payload.sourceOrganizationUnitIds &&
// 				payload.sourceOrganizationUnitIds.forEach((item) => {
// 					url +=
// 						"SourceOrganizationUnitIds=" + encodeURIComponent("" + item) + "&";
// 				});
// 		url = url.replace(/[?&]$/, "");
// 		try {
// 			const response = await apiClient.get(url);
// 			return thunkAPI.fulfillWithValue(response.data.result);
// 		} catch (error) {
// 			return thunkAPI.rejectWithValue(error);
// 		}
// 	}
// );

export const leadsService = {};
