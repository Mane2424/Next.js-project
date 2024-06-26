import { useAppSelector } from "@/redux";
import { dashboard } from "@/redux/selectors";
import ContentLoader from "../ContentLoader";

export const NewStatCard = () => {
	const totalStats = useAppSelector(dashboard.totalStats);

	return (
		<>
			{totalStats.isLoading ? (
				<ContentLoader />
			) : (
				<div className='mt-4'>
					<div className='flex flex-col gap-6 text-dark dark:text-white'>
						<h2 className='text-[22px] font-bold'>Totals</h2>
						<div className='flex flex-col gap-4'>
							<div className='flex items-end justify-between'>
								<span>New sales added</span>
								<span className='text-lg font-bold'>
									{totalStats?.data?.newOrderAmount
										? "$" + totalStats?.data?.newOrderAmount
										: 0}
								</span>
							</div>
							<div className='h-4 w-full rounded-lg bg-[#FF9C55]'></div>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex items-end justify-between'>
								<span>New leads added</span>
								<span className='text-lg font-bold'>
									{totalStats?.data?.newLeadCount ?? 0}
								</span>
							</div>
							<div className='h-4 w-full rounded-lg bg-[#8155FF]'></div>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex items-end justify-between'>
								<span>New clients added</span>
								<span className='text-lg font-bold'>
									{totalStats?.data?.newClientCount ?? 0}
								</span>
							</div>
							<div className='h-4 w-full rounded-lg bg-[#18BFFF]'></div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
