import React from "react";
import { AmountsContainer } from "./AmountsContainer";
import { CommissionHistory } from "./CommissionHistory";

export const MyCommissions = () => {
	return (
		<div className='h-full bg-white dark:bg-gray-dark'>
			<AmountsContainer />
			<CommissionHistory />
		</div>
	);
};
