import { RootState } from "../index";

const recentlyCreatedCustomers = (state: RootState) =>
	state.dashboard.recentlyCreatedCustomers;
const recentlyCreatedLeads = (state: RootState) =>
	state.dashboard.recentlyCreatedLeads;
const contactAndLeadStats = (state: RootState) =>
	state.dashboard.contactAndLeadStats;
const contactsByRegion = (state: RootState) => state.dashboard.contactsByRegion;
const totalStats = (state: RootState) => state.dashboard.totalStats;
const totalsBy = (state: RootState) => state.dashboard.totalsBy;

export const dashboard = {
	recentlyCreatedCustomers,
	recentlyCreatedLeads,
	contactAndLeadStats,
	contactsByRegion,
	totalStats,
	totalsBy,
};
