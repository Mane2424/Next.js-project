import React from "react";
import "@/styles/invoices.scss";
export const DueDateCell = ({ data }: any) => {
	const getDueDateValue = () => {
		if (data.DueDate) {
			const originalDate = new Date(data.DueDate);

			const month = originalDate.getMonth() + 1;
			const day = originalDate.getDate();
			const year = originalDate.getFullYear();

			return (
				(month < 10 ? "0" : "") +
				month +
				"/" +
				(day < 10 ? "0" : "") +
				day +
				"/" +
				year
			);
		} else {
			return "Due on Receipt";
		}
	};

	return (
		<div className='status-wrapper'>
			<div>{getDueDateValue()}</div>
		</div>
	);
};
