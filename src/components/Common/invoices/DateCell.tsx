import React from "react";
import "@/styles/invoices.scss";
export const DateCell = ({ data }: any) => {
	const originalDate = new Date(data.Date);

	const month = originalDate.getMonth() + 1;
	const day = originalDate.getDate();
	const year = originalDate.getFullYear();

	const formattedDate =
		(month < 10 ? "0" : "") +
		month +
		"/" +
		(day < 10 ? "0" : "") +
		day +
		"/" +
		year;
	return (
		<div className='status-wrapper !h-full'>
			<div>
				<span>{formattedDate}</span>
			</div>
		</div>
	);
};
