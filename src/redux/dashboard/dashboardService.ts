import apiClient from "@/config/api-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ITotalsByData } from "./dashboardTypes";
import { getGroupByFromRange } from "@/utils/getGroupBy";

const getTotalStats = createAsyncThunk(
	"/api/services/CRM/Dashboard/GetTotals",
	async (
		payload: {
			contactGroupId?: string | undefined;
			startDate?: string | undefined;
			endDate?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		let url = "/api/services/CRM/Dashboard/GetTotals?";
		if (payload.startDate === null)
			throw new Error("The parameter 'startDate' cannot be null.");
		else if (payload.startDate !== undefined)
			url +=
				"StartDate=" +
				encodeURIComponent(payload.startDate ? "" + payload.startDate : "") +
				"&";
		if (payload.endDate === null)
			throw new Error("The parameter 'endDate' cannot be null.");
		else if (payload.endDate !== undefined)
			url +=
				"EndDate=" +
				encodeURIComponent(payload.endDate ? "" + payload.endDate : "") +
				"&";
		if (payload.contactGroupId === null)
			throw new Error("The parameter 'contactGroupId' cannot be null.");
		else if (payload.contactGroupId !== undefined)
			url +=
				"ContactGroupId=" +
				encodeURIComponent("" + payload.contactGroupId) +
				"&";
		if (payload.sourceContactId === null)
			throw new Error("The parameter 'sourceContactId' cannot be null.");
		else if (payload.sourceContactId !== undefined)
			url +=
				"SourceContactId=" +
				encodeURIComponent("" + payload.sourceContactId) +
				"&";
		if (payload.sourceOrganizationUnitIds === null)
			throw new Error(
				"The parameter 'sourceOrganizationUnitIds' cannot be null."
			);
		else if (payload.sourceOrganizationUnitIds !== undefined)
			payload.sourceOrganizationUnitIds &&
				payload.sourceOrganizationUnitIds.forEach((item) => {
					url +=
						"SourceOrganizationUnitIds=" + encodeURIComponent("" + item) + "&";
				});
		url = url.replace(/[?&]$/, "");
		try {
			const response = await apiClient.get(url);
			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const getContactsByRegion = createAsyncThunk(
	"/api/services/CRM/Dashboard/GetContactsByRegion",
	async (
		payload: {
			contactGroupId?: string | undefined;
			startDate?: string | undefined;
			endDate?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		let url = "/api/services/CRM/Dashboard/GetContactsByRegion?";
		if (payload.startDate === null)
			throw new Error("The parameter 'startDate' cannot be null.");
		else if (payload.startDate !== undefined)
			url +=
				"StartDate=" +
				encodeURIComponent(payload.startDate ? "" + payload.startDate : "") +
				"&";
		if (payload.endDate === null)
			throw new Error("The parameter 'endDate' cannot be null.");
		else if (payload.endDate !== undefined)
			url +=
				"EndDate=" +
				encodeURIComponent(payload.endDate ? "" + payload.endDate : "") +
				"&";
		if (payload.contactGroupId === null)
			throw new Error("The parameter 'contactGroupId' cannot be null.");
		else if (payload.contactGroupId !== undefined)
			url +=
				"ContactGroupId=" +
				encodeURIComponent("" + payload.contactGroupId) +
				"&";
		if (payload.sourceContactId === null)
			throw new Error("The parameter 'sourceContactId' cannot be null.");
		else if (payload.sourceContactId !== undefined)
			url +=
				"SourceContactId=" +
				encodeURIComponent("" + payload.sourceContactId) +
				"&";
		if (payload.sourceOrganizationUnitIds === null)
			throw new Error(
				"The parameter 'sourceOrganizationUnitIds' cannot be null."
			);
		else if (payload.sourceOrganizationUnitIds !== undefined)
			payload.sourceOrganizationUnitIds &&
				payload.sourceOrganizationUnitIds.forEach((item) => {
					url +=
						"SourceOrganizationUnitIds=" + encodeURIComponent("" + item) + "&";
				});
		url = url.replace(/[?&]$/, "");
		try {
			const response = await apiClient.get(url);

			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const getRecentlyCreatedLeads = createAsyncThunk(
	"/api/services/CRM/Dashboard/getRecentlyCreatedLeads",
	async (
		payload: {
			topCount?: number | undefined;
			contactGroupId?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		try {
			let url = "/api/services/CRM/Dashboard/GetRecentlyCreatedLeads?";
			if (payload.topCount === null)
				throw new Error("The parameter 'topCount' cannot be null.");
			else if (payload.topCount !== undefined)
				url += "TopCount=" + encodeURIComponent("" + payload.topCount) + "&";
			if (payload.contactGroupId === null)
				throw new Error("The parameter 'contactGroupId' cannot be null.");
			else if (payload.contactGroupId !== undefined)
				url +=
					"ContactGroupId=" +
					encodeURIComponent("" + payload.contactGroupId) +
					"&";
			if (payload.sourceContactId === null)
				throw new Error("The parameter 'sourceContactId' cannot be null.");
			else if (payload.sourceContactId !== undefined)
				url +=
					"SourceContactId=" +
					encodeURIComponent("" + payload.sourceContactId) +
					"&";
			if (payload.sourceOrganizationUnitIds === null)
				throw new Error(
					"The parameter 'sourceOrganizationUnitIds' cannot be null."
				);
			else if (payload.sourceOrganizationUnitIds !== undefined)
				payload.sourceOrganizationUnitIds &&
					payload.sourceOrganizationUnitIds.forEach((item) => {
						url +=
							"SourceOrganizationUnitIds=" +
							encodeURIComponent("" + item) +
							"&";
					});
			url = url.replace(/[?&]$/, "");
			const response = await apiClient.get(url);
			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const getRecentlyCreatedCustomers = createAsyncThunk(
	"/api/services/CRM/Dashboard/GetRecentlyCreatedCustomers",
	async (
		payload: {
			topCount?: number | undefined;
			contactGroupId?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		try {
			let url = "/api/services/CRM/Dashboard/GetRecentlyCreatedCustomers?";
			if (payload.topCount === null)
				throw new Error("The parameter 'topCount' cannot be null.");
			else if (payload.topCount !== undefined)
				url += "TopCount=" + encodeURIComponent("" + payload.topCount) + "&";
			if (payload.contactGroupId === null)
				throw new Error("The parameter 'contactGroupId' cannot be null.");
			else if (payload.contactGroupId !== undefined)
				url +=
					"ContactGroupId=" +
					encodeURIComponent("" + payload.contactGroupId) +
					"&";
			if (payload.sourceContactId === null)
				throw new Error("The parameter 'sourceContactId' cannot be null.");
			else if (payload.sourceContactId !== undefined)
				url +=
					"SourceContactId=" +
					encodeURIComponent("" + payload.sourceContactId) +
					"&";
			if (payload.sourceOrganizationUnitIds === null)
				throw new Error(
					"The parameter 'sourceOrganizationUnitIds' cannot be null."
				);
			else if (payload.sourceOrganizationUnitIds !== undefined)
				payload.sourceOrganizationUnitIds &&
					payload.sourceOrganizationUnitIds.forEach((item) => {
						url +=
							"SourceOrganizationUnitIds=" +
							encodeURIComponent("" + item) +
							"&";
					});
			url = url.replace(/[?&]$/, "");
			const response = await apiClient.get(url);
			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const getTotalsBy = createAsyncThunk(
	"/api/services/CRM/Dashboard/getTotalsBy",
	async (
		payload: {
			contactGroupId?: string | undefined;
			by?: string;
			startDate?: string | undefined;
			endDate?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		try {
			let url = `/api/services/CRM/Dashboard/${payload.by}?`;
			if (payload.startDate === null)
				throw new Error("The parameter 'startDate' cannot be null.");
			else if (payload.startDate !== undefined)
				url +=
					"StartDate=" +
					encodeURIComponent(payload.startDate ? "" + payload.startDate : "") +
					"&";
			if (payload.endDate === null)
				throw new Error("The parameter 'endDate' cannot be null.");
			else if (payload.endDate !== undefined)
				url +=
					"EndDate=" +
					encodeURIComponent(payload.endDate ? "" + payload.endDate : "") +
					"&";
			if (payload.contactGroupId === null)
				throw new Error("The parameter 'contactGroupId' cannot be null.");
			else if (payload.contactGroupId !== undefined)
				url +=
					"ContactGroupId=" +
					encodeURIComponent("" + payload.contactGroupId) +
					"&";
			if (payload.sourceContactId === null)
				throw new Error("The parameter 'sourceContactId' cannot be null.");
			else if (payload.sourceContactId !== undefined)
				url +=
					"SourceContactId=" +
					encodeURIComponent("" + payload.sourceContactId) +
					"&";
			if (payload.sourceOrganizationUnitIds === null)
				throw new Error(
					"The parameter 'sourceOrganizationUnitIds' cannot be null."
				);
			else if (payload.sourceOrganizationUnitIds !== undefined)
				payload.sourceOrganizationUnitIds &&
					payload.sourceOrganizationUnitIds.forEach((item) => {
						url +=
							"SourceOrganizationUnitIds=" +
							encodeURIComponent("" + item) +
							"&";
					});
			url = url.replace(/[?&]$/, "");
			const response = await apiClient.get(url);

			let result: ITotalsByData[] = [];

			if (payload.by === "GetContactsByCompanySize") {
				result = response.data.result.map((item: any) => ({
					key: item.companySizeRange,
					value: item.contactCount,
				}));
			} else {
				result = response.data.result.map((item: any) => ({
					key: item.key,
					value: item.count,
				}));
			}
			return thunkAPI.fulfillWithValue(result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);
const getContactAndLeadStats = createAsyncThunk(
	"/api/services/CRM/Dashboard/getContactAndLeadStats",
	async (
		payload: {
			periodCount?: number | undefined;
			isCumulative?: boolean | undefined;
			startDate?: string | undefined;
			endDate?: string | undefined;
			contactGroupId?: string | undefined;
			sourceContactId?: number | undefined;
			sourceOrganizationUnitIds?: number[] | undefined;
		},
		thunkAPI
	) => {
		try {
			const groupBy =
				payload.startDate && payload.endDate
					? getGroupByFromRange(payload.startDate, payload.endDate)
					: "Monthly";
			let url = "/api/services/CRM/Dashboard/GetContactAndLeadStats?";
			if (groupBy === undefined || groupBy === null)
				throw new Error(
					"The parameter 'groupBy' must be defined and cannot be null."
				);
			else url += "GroupBy=" + encodeURIComponent("" + groupBy) + "&";
			if (payload.periodCount === null)
				throw new Error("The parameter 'periodCount' cannot be null.");
			else if (payload.periodCount !== undefined)
				url +=
					"PeriodCount=" + encodeURIComponent("" + payload.periodCount) + "&";
			if (payload.isCumulative === null)
				throw new Error("The parameter 'isCumulative' cannot be null.");
			else if (payload.isCumulative !== undefined)
				url +=
					"IsCumulative=" + encodeURIComponent("" + payload.isCumulative) + "&";
			if (payload.startDate === null)
				throw new Error("The parameter 'startDate' cannot be null.");
			else if (payload.startDate !== undefined)
				url +=
					"StartDate=" +
					encodeURIComponent(payload.startDate ? "" + payload.startDate : "") +
					"&";
			if (payload.endDate === null)
				throw new Error("The parameter 'endDate' cannot be null.");
			else if (payload.endDate !== undefined)
				url +=
					"EndDate=" +
					encodeURIComponent(payload.endDate ? "" + payload.endDate : "") +
					"&";
			if (payload.contactGroupId === null)
				throw new Error("The parameter 'contactGroupId' cannot be null.");
			else if (payload.contactGroupId !== undefined)
				url +=
					"ContactGroupId=" +
					encodeURIComponent("" + payload.contactGroupId) +
					"&";
			if (payload.sourceContactId === null)
				throw new Error("The parameter 'sourceContactId' cannot be null.");
			else if (payload.sourceContactId !== undefined)
				url +=
					"SourceContactId=" +
					encodeURIComponent("" + payload.sourceContactId) +
					"&";
			if (payload.sourceOrganizationUnitIds === null)
				throw new Error(
					"The parameter 'sourceOrganizationUnitIds' cannot be null."
				);
			else if (payload.sourceOrganizationUnitIds !== undefined)
				payload.sourceOrganizationUnitIds &&
					payload.sourceOrganizationUnitIds.forEach((item) => {
						url +=
							"SourceOrganizationUnitIds=" +
							encodeURIComponent("" + item) +
							"&";
					});
			url = url.replace(/[?&]$/, "");
			const response = await apiClient.get(url);

			return thunkAPI.fulfillWithValue(response.data.result);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const dashboardService = {
	getRecentlyCreatedCustomers,
	getRecentlyCreatedLeads,
	getContactAndLeadStats,
	getContactsByRegion,
	getTotalStats,
	getTotalsBy,
};
