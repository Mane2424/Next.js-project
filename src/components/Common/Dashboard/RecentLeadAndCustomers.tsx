import { useAppSelector } from "@/redux";
import {
	IRecentlyCreatedCustomer,
	IRecentlyCreatedLead,
} from "@/redux/dashboard/dashboardTypes";
import { dashboard } from "@/redux/selectors";

import moment from "moment";
// import Link from "next/link";
import { useEffect, useState } from "react";
import ContentLoader from "../ContentLoader";

type RecentLeadAndCustomersProps = {
	showLeadsTable: boolean;
	onChangeRecentDataTableType: (val: boolean) => void;
};

const RecentLeadAndCustomers = (props: RecentLeadAndCustomersProps) => {
	const { showLeadsTable, onChangeRecentDataTableType } = props;
	const [openModal, setOpenModal] = useState<boolean>(false);
	const recentlyCreatedCustomers = useAppSelector(
		dashboard.recentlyCreatedCustomers
	);
	const recentlyCreatedLeads = useAppSelector(dashboard.recentlyCreatedLeads);
	const [data, setData] = useState<
		IRecentlyCreatedCustomer[] | IRecentlyCreatedLead[] | null
	>([]);
	const [sortBy, setSortBy] = useState<string>("creationTime");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [value, setValue] = useState<string>("Recent Leads");
	const handleSort = (key: string) => {
		if (sortBy === key) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(key);
			setSortOrder("asc");
		}
	};
	const onSelectValue = (value: boolean, text: string) => {
		onChangeRecentDataTableType(value);
		setOpenModal(false);
		setValue(text);
	};
	const sortedData = data?.slice().sort((a: any, b: any) => {
		if (sortBy === null) {
			return 0;
		}

		if (a[sortBy] < b[sortBy]) {
			return sortOrder === "asc" ? -1 : 1;
		}

		if (a[sortBy] > b[sortBy]) {
			return sortOrder === "asc" ? 1 : -1;
		}

		return 0;
	});
	useEffect(() => {
		setData(
			showLeadsTable
				? recentlyCreatedLeads?.data
				: recentlyCreatedCustomers?.data
		);
	}, [
		showLeadsTable,
		recentlyCreatedLeads?.data,
		recentlyCreatedCustomers?.data,
	]);
	return (
		<>
			{recentlyCreatedCustomers.isLoading || recentlyCreatedLeads.isLoading ? (
				<ContentLoader />
			) : (
				<div className='mt-4'>
					<div className=''>
						<div className='flex flex-wrap items-center gap-5 text-dark dark:text-white'>
							<div className='relative w-55'>
								<button
									className='flex items-center space-x-1 text-xl font-semibold focus:outline-none'
									onClick={() => setOpenModal(!openModal)}
								>
									<span className='max-w-[350px] truncate text-[22px] font-bold'>
										{value}
									</span>
									<svg
										className='-mr-1 ml-2 h-5 w-5'
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
									<ul className='absolute right-0 z-10 mt-2 w-full origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<li>
											<button
												className='block w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100'
												onClick={() => onSelectValue(true, "Recent Leads")}
											>
												Recent Leads
											</button>
										</li>
										<li>
											<button
												className='block w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100'
												onClick={() => onSelectValue(false, "Recent Customers")}
											>
												Recent Customers
											</button>
										</li>
									</ul>
								)}
							</div>
							<p className='text-[14px] font-normal text-gray-400'>{`Last 10 ${
								value === "Recent Leads"
									? "clients registered"
									: "customers registered"
							}`}</p>
							{value === "Recent Leads" && (
								<a
									href='/app/leads'
									className='ml-auto flex cursor-pointer items-center gap-2 text-[#E4661D]'
								>
									<span className='text-[15px] font-semibold underline'>
										See all records
									</span>
								</a>
							)}
						</div>
						<table className='mt-4 w-full table-fixed text-dark dark:text-white'>
							<thead>
								<tr className='border-b-[1px] border-b-[#edf2f7]'>
									<th
										className='cursor-pointer'
										onClick={() => handleSort("fullName")}
									>
										<div className='flex items-center px-6 py-3'>
											<span className='text-[14px] font-normal'>NAME</span>
										</div>
									</th>
									<th
										className='cursor-pointer'
										onClick={() => handleSort("creationTime")}
									>
										<div className='flex items-center px-6 py-3'>
											<span className='text-[14px] font-normal'>CREATED</span>
										</div>
									</th>
								</tr>
							</thead>
							<tbody className='[&>*:nth-child(odd)]:bg-[#635bff1a]'>
								{sortedData?.map((item: any) => (
									<tr
										key={item.id + item.fullName}
										className='border-b-[1px] border-b-[#edf2f7]'
									>
										<td className='px-2.5 py-2'>
											<span className='text-[15px] font-semibold'>
												{item.fullName}
											</span>
										</td>
										<td className='px-2.5 py-2 text-[15px] font-medium'>
											{moment(item.creationTime).format("MM/DD/YYYY hh:mm A")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</>
	);
};

export default RecentLeadAndCustomers;
