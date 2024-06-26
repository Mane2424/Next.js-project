import React from "react";
import { PendingTransactionsGrid } from "./PendingTransactionsGrid";
import "@/styles/refferalPageLedger.scss";

export const LedgerHistory = () => {
	return (
		<div className='ledger-page'>
			<PendingTransactionsGrid />
		</div>
	);
};
