export enum PaymentSettingType {
	PayPal = "PayPal",
	Stripe = "Stripe",
	BankTransfer = "BankTransfer",
}

export interface IAffiliatePayoutSettingInfo {
	type: PaymentSettingType;
	isDefault: boolean;
	emailAddress: string | undefined;
	stripeAccountID: string | undefined;
	isStripeAccountCompleted: boolean | undefined;
	paymentCurrency: string | undefined;
	accountName: string | undefined;
	bankCode: string | undefined;
	accountNumber: string | undefined;
	iban: string | undefined;
	nationalIDNumber: string | undefined;
	taxID: string | undefined;
	swift: string | undefined;
	bankName: string | undefined;
	bankAddress: string | undefined;
	bankAddress2: string | undefined;
	bankCity: string | undefined;
	bankState: string | undefined;
	bankZip: string | undefined;
	country: string | undefined;
	intermediarySwift: string | undefined;
	intermediaryBankName: string | undefined;
	intermediaryBankCountry: string | undefined;
	intermediaryBankCity: string | undefined;
	intermediaryAccountNumber: string | undefined;
}

export interface IAffiliatePayoutSettingInput {
	type: PaymentSettingType;
	isDefault: boolean;
	emailAddress: string | undefined;
	paymentCurrency: string | undefined;
	accountName: string | undefined;
	bankCode: string | undefined;
	accountNumber: string | undefined;
	iban: string | undefined;
	nationalIDNumber: string | undefined;
	taxID: string | undefined;
	swift: string | undefined;
	bankName: string | undefined;
	bankAddress: string | undefined;
	bankAddress2: string | undefined;
	bankCity: string | undefined;
	bankState: string | undefined;
	bankZip: string | undefined;
	country: string | undefined;
	intermediarySwift: string | undefined;
	intermediaryBankName: string | undefined;
	intermediaryBankCountry: string | undefined;
	intermediaryBankCity: string | undefined;
	intermediaryAccountNumber: string | undefined;
}
