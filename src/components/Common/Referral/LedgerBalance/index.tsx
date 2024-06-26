import React from "react";
import { AmountsContainer } from "../MyCommissions/AmountsContainer";
import { LedgerHistory } from "./LedgerHistory";

export const LegderBalance = () => {
	return (
		<div className='h-[calc(100vh-140px)] bg-white dark:bg-gray-dark'>
			<AmountsContainer />
			<LedgerHistory />
		</div>
	);
};
