import React, { useState } from "react";
import { Subscription } from "./Subscription";
import { PaymentInfo } from "./PaymentInfo";
enum ETitleValues {
	subscriptions = "My Subscriptions",
	payments = "Payments",
}
const subTitles: string[] = ["My Subscriptions", "Payments"];
export const MySubscriptions = () => {
	const [subPage, setSubPage] = useState<string>(subTitles[0]);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	return (
		<div className='h-[75vh] w-[75vw]'>
			<div>
				<div className='flex flex-col gap-4'>
					<div className='mt-4.5 flex'>
						{subTitles.map((item, index) => (
							<button
								key={item}
								className={`flex w-[50%] items-center justify-center gap-2.5 text-center text-[25px] font-medium dark:text-white ${
									item === subPage ? "text-[#0e172b]" : ""
								}`}
								onClick={() => {
									setSubPage(item as ETitleValues);
									setActiveIndex(index);
								}}
							>
								{item}
							</button>
						))}
					</div>
					<div
						className={`h-0.5 w-[50%] bg-[#1c274c] transition-all dark:bg-white`}
						style={{ marginLeft: `${activeIndex * 50}%` }}
					/>
				</div>
				{subPage === ETitleValues.subscriptions ? (
					<Subscription />
				) : (
					<PaymentInfo />
				)}
			</div>
		</div>
	);
};
