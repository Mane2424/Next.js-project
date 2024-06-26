import { KeysEnum } from "./invoices";
export interface CommissionDto {
	Id: number;
	OrderDate: string;
	OrderNumber: string;
	EarnedDate: string;
	CustomerName: string;
	ProductName: string;
	ProductAmount: number;
	Tier: string;
	CommissionAmount: number;
	CurrencyId: string;
	Status: string;
}
export const CommissionFields: KeysEnum<CommissionDto> = {
	Id: "Id",
	OrderDate: "OrderDate",
	OrderNumber: "OrderNumber",
	EarnedDate: "EarnedDate",
	CustomerName: "CustomerName",
	ProductName: "ProductName",
	ProductAmount: "ProductAmount",
	Tier: "Tier",
	CommissionAmount: "CommissionAmount",
	CurrencyId: "CurrencyId",
	Status: "Status",
};
