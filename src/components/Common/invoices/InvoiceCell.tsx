import React from "react";
import "@/styles/invoices.scss";
export const InvoiceCell = ({ data }: any) => {
	return (
		<div className='status-wrapper'>
			<span className='invoice-id dark:!text-white'>{data.Id}</span>
		</div>
	);
};
