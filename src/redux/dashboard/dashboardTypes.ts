export interface IContactByRegion {
	countryId: string;
	stateId?: string | null;
	count: number;
}
export interface IRecentlyCreatedLead {
	leadId: number;
	contactId: number;
	fullName: string;
	email: string;
	phone?: string;
	bankCode?: string | null;
	creationTime: string;
}
export interface IRecentlyCreatedCustomer {
	bankCode?: string | null;
	contactId: number;
	creationTime: string;
	email: string;
	fullName: string;
	phone?: string;
}

export interface ITotalsByData {
	value: number;
	key?: string | null;
}
export interface IContactAndLeadStat {
	date: string;
	customerCount: number;
	leadTotalCount: number;
	leadStageCount: { [key: string]: number };
}
export interface ITotalStat {
	newLeadCount: number;
	newClientCount: number;
	newOrderAmount: number;
	totalLeadCount: number;
	totalClientCount: number;
	totalOrderAmount: number;
}
