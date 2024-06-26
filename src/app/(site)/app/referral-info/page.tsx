"use client";
import { ReferralHeader } from "@/components/Common/Referral/ReferralHeader";

import React, { useState } from "react";
import { Dashboard } from "@/components/Common/Referral/Dashboard";
import { MyLinks } from "@/components/Common/Referral/MyLinks";
import { MyCommissions } from "@/components/Common/Referral/MyCommissions";
import { LegderBalance } from "@/components/Common/Referral/LedgerBalance";

const subTitles: {
	label: string;
	value: string;
}[] = [
	{
		label: "Dashboard",
		value: "dashboard",
	},
	{
		label: "My Links",
		value: "myLinks",
	},
	{
		label: "My Commissions",
		value: "myCommissions",
	},
	{
		label: "Ledger Balance",
		value: "ledgerBalance",
	},
];
const subComponents = {
	dashboard: Dashboard,
	myLinks: MyLinks,
	myCommissions: MyCommissions,
	ledgerBalance: LegderBalance,
};
const ReferralPortal = () => {
	const [subPage, setSubPage] = useState<string>(subTitles[0].value);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const SubComponent = subComponents[subPage as keyof typeof subComponents];
	if (!SubComponent) return <></>;
	return (
		<div>
			<ReferralHeader
				subTitles={subTitles}
				subPage={subPage}
				setSubPage={setSubPage}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
			/>
			<SubComponent />
		</div>
	);
};

export default ReferralPortal;
