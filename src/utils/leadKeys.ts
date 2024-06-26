export const leadKeys: {
	key: string;
	caption: string;
	visible: boolean;
	dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
}[] = [
	{ key: "Id", caption: "Id", visible: false },
	{ key: "ContactId", caption: "ContactId", visible: false },
	{ key: "CustomerId", caption: "CustomerId", visible: false },
	{ key: "UserId", caption: "UserId", visible: false },
	{ key: "PhotoPublicId", caption: "", visible: true },
	{ key: "Name", caption: "Name", visible: true },
	{ key: "CompanyName", caption: "Company Name", visible: true },
	{ key: "Email", caption: "Email", visible: true },
	{ key: "Phone", caption: "Phone", visible: true },
	{ key: "City", caption: "City", visible: true },
	{ key: "State", caption: "State", visible: true },
	{ key: "Stage", caption: "Stage", visible: true },
	{ key: "LeadDate", caption: "Created", visible: true, dataType: "datetime" },
	{ key: "Campaign", caption: "Campaign", visible: false },
	{ key: "Channel", caption: "Channel", visible: false },
	{ key: "EntryUrl", caption: "Entry Url", visible: false },
	{ key: "LastModified", caption: "Last Modified", visible: false },
	{ key: "SourceCode", caption: "Source Code", visible: false },
	{ key: "StreetAddress", caption: "Street Address", visible: false },
	{ key: "Zip", caption: "Zip", visible: false },
	{ key: "Website", caption: "Website", visible: false },
	{ key: "PhoneExtension", caption: "Phone Extension", visible: false },
	{ key: "Title", caption: "Title", visible: false },
	{ key: "ContactXref", caption: "Contact Xref", visible: false },
	{ key: "SourceContact", caption: "Source Contact", visible: false },
	{ key: "AssignedTo", caption: "Assigned To", visible: false },
	{ key: "OrganizationId", caption: "OrganizationId", visible: false },
];
