import { InvoiceStatus } from "./appEnums";

export type KeysEnum<T> = { [P in keyof Required<T>]: string };

export interface UserInvoiceDto {
	Amount: number;
	Date: string;
	DueDate: string;
	Id: number;
	Number: string;
	Status: InvoiceStatus;
}

export const InvoiceFields: KeysEnum<UserInvoiceDto> = {
	Amount: "Amount",
	Date: "Date",
	DueDate: "DueDate",
	Id: "Id",
	Number: "Number",
	Status: "Status",
};
