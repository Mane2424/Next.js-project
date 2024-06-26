"use client";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import moment from "moment";
import { useEffect, useState } from "react";
import { dashboard } from "@/redux/selectors";
import { useAppSelector } from "@/redux";
import ContentLoader from "../ContentLoader";

type StatisticsChartProps = {
	isCumulative: boolean;
	onChangeChartOption: (val: boolean) => void;
};

const StatisticsChart = (props: StatisticsChartProps) => {
	const { isCumulative, onChangeChartOption } = props;
	const contactAndLeadStats = useAppSelector(dashboard.contactAndLeadStats);
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [data, setData] = useState<any>();
	useEffect(() => {
		const formatedData: any[] = [];
		contactAndLeadStats?.data?.forEach(
			(item: {
				date: moment.MomentInput;
				leadTotalCount: any;
				customerCount: any;
				leadStageCount: { [s: string]: unknown } | ArrayLike<unknown>;
			}) => {
				formatedData.push({
					name: moment(item.date).format("MMM DD"),
					Won: item.leadTotalCount,
					"Active Client Count": item.customerCount,
					leadStage: Object.values(item.leadStageCount)?.[0] ?? 0,
				});
			}
		);
		setData(formatedData);
	}, [contactAndLeadStats]);
	return (
		<>
			{contactAndLeadStats.isLoading ? (
				<ContentLoader />
			) : (
				<div className='mt-4'>
					<div className='flex items-center gap-3 text-dark dark:text-white'>
						<h2 className='text-[22px] font-bold'>Statistics</h2>
						<div className='relative'>
							<button
								className='inline-flex items-center justify-center space-x-2 bg-transparent text-gray-500'
								onClick={() => setOpenMenu(!openMenu)}
							>
								<span className='max-w-xs truncate text-dark dark:text-white sm:max-w-sm md:max-w-md'>
									{!isCumulative
										? "Net Lead Stage Ratio and Client Count"
										: "Cumulative Lead Stage Ratio and Client Count"}
								</span>
								<svg
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M6 8l4 4 4-4'
										clipRule='evenodd'
									/>
								</svg>
							</button>
							{openMenu && (
								<div className='absolute left-0 z-[5] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-dark dark:text-white'>
									<ul className='py-1'>
										<li>
											<button
												className='block w-full px-4 py-2 text-left text-sm text-dark dark:text-white'
												onClick={() => {
													onChangeChartOption(false);
													setOpenMenu(false);
												}}
											>
												Net Lead Stage Ratio and Client Count
											</button>
										</li>
										<li>
											<button
												className='block w-full px-4 py-2 text-left text-sm text-dark dark:text-white'
												onClick={() => {
													onChangeChartOption(true);
													setOpenMenu(false);
												}}
											>
												Cumulative Lead Stage Ratio and Client Count
											</button>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
					<ResponsiveContainer width='99%' height={300}>
						<ComposedChart data={data}>
							<Legend align='right' verticalAlign='top' />
							<CartesianGrid stroke='gray' vertical={false} />
							<XAxis dataKey='name' />
							<YAxis axisLine={false} />
							<Tooltip />
							<Bar dataKey='Won' barSize={30} fill='#8155FF' />
							<Line
								type='bump'
								fill='#8487e7'
								dataKey='Active Client Count'
								stroke='#8487e7'
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			)}
		</>
	);
};

export default StatisticsChart;
