import React, { useState } from "react";
enum ETitleValues {
	dashboard = "Partner Dashboard",
	myLinks = "My Links",
	myCommissions = "Your commission transaction history",
	ledgerBalance = "Your payout ledger history",
}

export const ReferralHeader = ({
	subTitles,
	subPage,
	setSubPage,
	activeIndex,
	setActiveIndex,
}: {
	subTitles: {
		label: string;
		value: string;
	}[];
	subPage: string;
	activeIndex: number;
	setSubPage: React.Dispatch<React.SetStateAction<string>>;
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const [titleValue, setTitleValue] = useState<ETitleValues>(
		ETitleValues.dashboard
	);
	return (
		<div className='flex h-[50px] w-full items-center justify-between border-b pl-5'>
			<h3 className='font-semibold text-[#0e172b] dark:!text-white'>
				{titleValue}
			</h3>
			<div className='flex  flex-col gap-3 '>
				<div className='mt-4.5 flex'>
					{subTitles.map((item, index) => (
						<button
							key={item.value}
							className={`flex w-[110px] items-center justify-center gap-2.5 text-center text-xs font-medium dark:text-white ${
								item.value === subPage ? "text-[#0e172b]" : ""
							}`}
							onClick={() => {
								setSubPage(item.value);
								setActiveIndex(index);
								setTitleValue(
									ETitleValues[item.value as keyof typeof ETitleValues]
								);
							}}
						>
							{item.label}
						</button>
					))}
				</div>
				<div
					className={`h-0.5 w-[110px] bg-[#1c274c] transition-all dark:bg-white`}
					style={{ marginLeft: `${activeIndex * 110}px` }}
				/>
			</div>
		</div>
	);
};
