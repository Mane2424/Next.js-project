import React from "react";
import "@/styles/invoices.scss";
export const StatusCell = ({ data }: any) => {
	return (
		<div className='status-wrapper'>
			<div
				className={`status ${data.Status.toLowerCase()} dark:!bg-slate-600 dark:!text-white`}
			>
				{data.Status.toUpperCase()}
			</div>
		</div>
	);
};
