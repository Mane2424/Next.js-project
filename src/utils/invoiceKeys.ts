export const invoiceKeys: {
	key: string;
	caption: string;
	visible: boolean;
	dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
}[] = [
	{ key: "Id", caption: "INVOICE", visible: true },
	{ key: "Amount", caption: "AMOUNT", visible: true },
	{ key: "Status", caption: "STATUS", visible: true },
	{ key: "Date", caption: "DATE", visible: true },
	{ key: "DueDate", caption: "DUE DATE", visible: true },
];
