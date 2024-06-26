import React from "react";
import "@/styles/invoices.scss";
const currency: any = {
	USD: "$",
	EUR: "€",
};
export const AmountCell = ({ data }: any) => {
	const formattedAmount = currency[data.CurrencyId] + data.Amount.toFixed(2);
	return (
		<div className='status-wrapper'>
			<div>{formattedAmount}</div>
		</div>
	);
};
