"use client";
import { useAppSelector } from "@/redux";
import { dashboard } from "@/redux/selectors";
import { useCallback, useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import ContentLoader from "../ContentLoader";

export const totalsByChartOptions = [
	{ name: "Star/Credit Rating", key: "GetContactsByStar" },
	{ name: "Lead Stage Distribution", key: "GetLeadsCountByStage" },
	{ name: "Lead Age Distribution", key: "GetLeadsCountByAge" },
	{ name: "Company Size", key: "GetContactsByCompanySize" },
	{ name: "Rating", key: "GetContactsByRating" },
];

type TotalsByChartProps = {
	chartType: { name: string; key: string };
	onChangeChartType: (val: { name: string; key: string }) => void;
};

const renderActiveShape = (props: any) => {
	const {
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value,
	} = props;

	return (
		<g>
			<text
				x={cx}
				y={cy}
				dy={-30}
				fontSize={20}
				textAnchor='middle'
				fill={fill}
			>
				{payload.key ?? "Unknown"}
			</text>
			<text
				x={cx}
				y={cy}
				dy={12}
				fontSize={30}
				fontWeight={700}
				textAnchor='middle'
				fill={fill}
			>
				{value}
			</text>
			<text x={cx} y={cy} dy={40} textAnchor='middle' fill={fill}>
				{`${(percent * 100).toFixed(1)}%`}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 2}
				outerRadius={outerRadius + 4}
				fill={fill}
			/>
		</g>
	);
};

const TotalsByChart = (props: TotalsByChartProps) => {
	const { chartType, onChangeChartType } = props;
	const totalsBy = useAppSelector(dashboard.totalsBy);
	const [activeIndex, setActiveIndex] = useState(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [data, setData] = useState<any>(undefined);
	const onPieEnter = useCallback(
		(_: any, index: number) => {
			setActiveIndex(index);
		},
		[setActiveIndex]
	);
	useEffect(() => {
		if (totalsBy?.data) {
			setData(totalsBy?.data);
		}
	}, [totalsBy]);
	return (
		<>
			{totalsBy.isLoading ? (
				<ContentLoader />
			) : (
				<div className='flex h-full flex-col text-dark dark:bg-gray-dark'>
					<div className='flex justify-between gap-5 dark:bg-gray-dark dark:text-white'>
						<h2 className='text-[22px] font-bold'>Totals By</h2>
						<div className='relative w-[190px]'>
							<button
								className='border-gray-3000 flex w-full items-center justify-between rounded-md border bg-transparent px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
								aria-haspopup='true'
								aria-expanded='true'
								onClick={() => setOpenModal(!openModal)}
							>
								<span className='truncate text-dark dark:text-white'>
									{chartType.name}
								</span>
								<svg
									className='-mr-1 ml-2 h-4 w-4'
									fill='currentColor'
									viewBox='0 0 20 20'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										d='M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'
										clipRule='evenodd'
									></path>
								</svg>
							</button>
							{openModal && (
								<div className='absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-dark dark:text-white'>
									<ul className='py-1'>
										{totalsByChartOptions.map((option) => (
											<li key={option.key}>
												<button
													className='block px-4 py-2 text-sm text-dark dark:text-white'
													type='button'
													onClick={() => {
														onChangeChartType(option);
														setOpenModal(false);
													}}
												>
													{option.name}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
					<div className='flex h-full w-full items-center pb-7.5'>
						<div className='h-[440px] w-full'>
							{data && (
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											activeIndex={activeIndex}
											activeShape={renderActiveShape}
											onMouseEnter={onPieEnter}
											data={data}
											dataKey='value'
											nameKey='key'
											outerRadius='95%'
											innerRadius='85%'
											fill='#8884d8'
										/>
									</PieChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TotalsByChart;
