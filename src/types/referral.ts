import moment from "moment";

export enum CommissionLedgerEntryStatus {
	Pending = "Pending",
	Approved = "Approved",
	Completed = "Completed",
	Cancelled = "Cancelled",
}
export enum CommissionLedgerEntryType {
	Earning = "Earning",
	Withdrawal = "Withdrawal",
}
export interface ICommissionLedgerEntryInfo {
	id: number;
	date: moment.Moment;
	startDate: moment.Moment;
	endDate: moment.Moment | undefined;
	status: CommissionLedgerEntryStatus;
	type: CommissionLedgerEntryType;
	totalAmount: number;
	paymentSystem: PaymentSystem | undefined;
	balance?: number;
}
export enum PaymentSystem {
	CheckPayment = "CheckPayment",
	CreditAccountBalance = "CreditAccountBalance",
	CryptoBitcoin = "CryptoBitcoin",
	DebitCardTransfer = "DebitCardTransfer",
	TransferBankACH = "TransferBankACH",
	TransferBankSEPA = "TransferBankSEPA",
	TransferBankWire = "TransferBankWire",
	PayQuicker = "PayQuicker",
	PayPal = "PayPal",
	Tipalti = "Tipalti",
	Stripe = "Stripe",
}
