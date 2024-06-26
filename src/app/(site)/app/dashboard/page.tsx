"use client";
import React, { useEffect, useState } from "react";
import DataStatsCard from "@/components/Common/Dashboard/DataStatsCard";
import { dataStats } from "@/staticData/statsData";
import { startOfYear, endOfYear } from "date-fns";
import { Drawer } from "@/components/Common/Drawer/Drawer";
import { Button } from "@/components/Common/Dashboard/Button";
import { NewStatCard } from "@/components/Common/Dashboard/NewStatCard";
import TotalsByChart, {
	totalsByChartOptions,
} from "@/components/Common/Dashboard/TotalsByChart";
import StatisticsChart from "@/components/Common/Dashboard/StatisticsChart";
import { useActions } from "@/app/hooks/useActions";
import RecentLeadAndCustomers from "@/components/Common/Dashboard/RecentLeadAndCustomers";
import Image from "next/image";
import RegionChart from "@/components/Common/Dashboard/RegionChart";
import { ContactGroup } from "@/types/appEnums";
import { CustomCalendar } from "@/components/Common/Dashboard/Calendar";
import { useAppSelector } from "@/redux";
import { dashboard } from "@/redux/selectors";
import apiClient from "@/config/api-client";
const recordsCount = 10;

const Dashboard: React.FC = () => {
	const {
		getRecentlyCreatedCustomers,
		getRecentlyCreatedLeads,
		getContactAndLeadStats,
		getContactsByRegion,
		getTotalStats,
		getTotalsBy,
	} = useActions();
	const [openCalendar, setOpenCalendar] = useState<boolean>(false);
	const [calendarLabel, setCalendarLabel] = useState("This Year");
	const [isCumulative, setIsCumulative] = useState(false);
	const [showLeadsTable, setShowLeadsTable] = useState(true);
	const [contactGroupId] = useState<string>(ContactGroup.Client);
	const [contactId] = useState<undefined>(undefined);
	const [orgUnitsIds] = useState<number[]>([]);
	const [error, setError] = useState(false);
	const totalStats = useAppSelector(dashboard.totalStats);
	const [totalsByChartType, setTotalsByChartType] = useState(
		totalsByChartOptions[3]
	);
	const [dateRange, setDateRange] = useState<{
		startDate: Date;
		endDate: Date;
	}>({
		startDate: startOfYear(new Date()),
		endDate: endOfYear(new Date()),
	});
	const getPermision = async () => {
		await apiClient
			.get("api/services/CRM/Pipeline/GetPipelineDefinitions")
			.then(() => {})
			.catch((e) => {
				setError(e?.response?.data?.error?.message);
			});
	};
	const getFeedData = (startDate = "", endDate = "") => {
		getRecentlyCreatedLeads({
			topCount: recordsCount,
			contactGroupId,
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
		getRecentlyCreatedCustomers({
			topCount: recordsCount,
			contactGroupId,
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
		getContactAndLeadStats({
			sourceOrganizationUnitIds: orgUnitsIds,
			sourceContactId: contactId,
			periodCount: undefined,
			contactGroupId,
			isCumulative,
			startDate,
			endDate,
		});
		getTotalStats({
			contactGroupId,
			startDate,
			endDate,
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
		getContactsByRegion({
			contactGroupId,
			startDate,
			endDate,
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
		getTotalsBy({
			contactGroupId,
			by: totalsByChartType.key,
			startDate,
			endDate,
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
	};
	const closeDrawer = () => {
		setOpenCalendar(false);
	};
	const onChangeDateRange = ({
		startDate,
		endDate,
		label,
	}: {
		label: string;
		startDate: Date;
		endDate: Date;
	}) => {
		setDateRange({ startDate, endDate });
		setCalendarLabel(label);
		const start = startDate ? startDate.toISOString() : "";
		const end = endDate ? endDate.toISOString() : "";
		getFeedData(start, end);
		setOpenCalendar(false);
	};

	const onChangeChartOption = (val: boolean) => {
		if (val !== isCumulative) {
			const startDate = dateRange.startDate
				? dateRange.startDate.toISOString()
				: "";
			const endDate = dateRange.endDate ? dateRange.endDate.toISOString() : "";

			setIsCumulative(val);
			getContactAndLeadStats({
				sourceOrganizationUnitIds: orgUnitsIds,
				sourceContactId: contactId,
				periodCount: undefined,
				contactGroupId,
				isCumulative: val,
				startDate,
				endDate,
			});
		}
	};
	const onChangeTotalsByChartType = (val: { name: string; key: string }) => {
		if (val.key !== totalsByChartType.key) {
			setTotalsByChartType(val);

			const startDate = dateRange.startDate
				? dateRange.startDate.toISOString()
				: "";
			const endDate = dateRange.endDate ? dateRange.endDate.toISOString() : "";

			getTotalsBy({ contactGroupId, by: val.key, startDate, endDate });
		}
	};
	const onChangeRecentDataTableType = (val: boolean) => {
		if (!val === showLeadsTable) {
			setShowLeadsTable(val);
			if (val) {
				getRecentlyCreatedLeads({
					topCount: recordsCount,
					contactGroupId,
					sourceContactId: contactId,
					sourceOrganizationUnitIds: orgUnitsIds,
				});
			} else {
				getRecentlyCreatedCustomers({
					topCount: recordsCount,
					contactGroupId,
					sourceContactId: contactId,
					sourceOrganizationUnitIds: orgUnitsIds,
				});
			}
		}
	};
	useEffect(() => {
		getPermision();
		const startDate = dateRange.startDate
			? dateRange.startDate.toISOString()
			: "";
		const endDate = dateRange.endDate ? dateRange.endDate.toISOString() : "";
		getFeedData(startDate, endDate);
	}, []);
	if (error)
		return (
			<div className='mt-25 w-full'>
				<div className='flex flex-col items-center justify-center'>
					<Image
						src='/images/no-data-icon.png'
						width={141}
						height={141}
						alt='NoData'
					/>
					<h3 className='mt-6 text-[24px] font-semibold text-[#202b35] dark:text-white'>
						{"You don't have access to this page"}
					</h3>
				</div>
			</div>
		);
	return (
		<div className='flex flex-col gap-7.5 px-8 py-10'>
			<div className='flex items-end justify-end gap-2'>
				<div className='w-[150px]'>
					<Button height='50px' onClick={() => setOpenCalendar(true)}>
						{calendarLabel}
					</Button>
				</div>
				<div className='w-[50px]'>
					<Button
						height='50px'
						onClick={() => getFeedData()}
						className='!rounded-full'
					>
						<Image
							className='brightness-0 invert filter dark:brightness-100 dark:invert-0'
							src='/images/icon/refresh.svg'
							alt='refresh'
							height={35}
							width={35}
						/>
					</Button>
				</div>
			</div>
			<div className='grid min-h-[140px] grid-cols-1 gap-7.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
				{dataStats.map((data, index) => {
					return (
						<DataStatsCard
							key={data?.id}
							data={{
								...data,
								value:
									index === 0
										? totalStats.data?.totalOrderAmount ?? 0
										: index === 1
											? totalStats.data?.totalLeadCount ?? 0
											: totalStats.data?.totalClientCount ?? 0,
							}}
							loading={totalStats.isLoading}
							index={index}
						/>
					);
				})}
			</div>
			<div className='flex flex-col gap-7.5'>
				<div className='grid grid-cols-1 gap-7.5 lg:grid-cols-3'>
					<div className='col-span-1 min-h-[390px] rounded-lg bg-white px-7.5 pb-7.5 pt-6 shadow dark:bg-gray-dark'>
						<NewStatCard />
					</div>
					<div className='col-span-2 min-h-[390px] rounded-lg bg-white px-9 pb-7.5 pt-6 shadow dark:bg-gray-dark'>
						<StatisticsChart
							isCumulative={isCumulative}
							onChangeChartOption={onChangeChartOption}
						/>
					</div>
				</div>
				<div className='grid grid-cols-1 gap-7.5 lg:grid-cols-3'>
					<div className='col-span-1 min-h-[590px] rounded-lg bg-white p-7.5 shadow dark:bg-gray-dark'>
						<TotalsByChart
							chartType={totalsByChartType}
							onChangeChartType={onChangeTotalsByChartType}
						/>
					</div>
					<div className='col-span-2 min-h-[590px] rounded-lg bg-white px-7.5 pb-10.5 pt-7 shadow dark:bg-gray-dark'>
						<RecentLeadAndCustomers
							onChangeRecentDataTableType={onChangeRecentDataTableType}
							showLeadsTable={showLeadsTable}
						/>
					</div>
				</div>
			</div>
			<RegionChart />
			<Drawer isOpen={openCalendar} onClose={closeDrawer} width={400} title=''>
				<CustomCalendar
					start={dateRange.startDate}
					end={dateRange.endDate}
					onChangeDateRange={onChangeDateRange}
				/>
			</Drawer>
		</div>
	);
};

export default Dashboard;
