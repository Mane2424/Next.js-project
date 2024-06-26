import React, { useEffect, useState } from "react";
import DataGrid, { Column, Scrolling, Pager } from "devextreme-react/data-grid";
import {
	getSubscriptionHistory,
	userSubscriptionCancel,
} from "@/services/blob.service";
import moment from "moment";
import "@/styles/subscription.scss";
import { useTheme } from "next-themes";
import { Tooltip } from "devextreme-react/tooltip";
import CustomModal from "../Common/Modals/CustomModal";
import { Button } from "../Common/Dashboard/Button";
import Image from "next/image";
export const Subscription = ({ hasManagePaymentsPermission }: any) => {
	const [subscriptionHistory, setSubscriptionHistory] = useState<any>([]);
	const [cancelModal, setCancelModal] = useState<boolean>(false);
	const [selectedCell, setSelectedCell] = useState<any>({});
	const { theme } = useTheme();
	const dateTimeTemplate = (cellData: any) => (
		<div className='date-box center-item'>
			{cellData?.value && (
				<span className='date-time' title={cellData?.value}>
					{new Date(cellData?.value).toLocaleDateString()}
				</span>
			)}
		</div>
	);
	const nameTimeTemplate = (cellData: any) => (
		<div className='date-box center-item'>
			<span className='date-time'>{cellData.data.productName}</span>
		</div>
	);
	const paymentPeriodTypeTemplate = (cellData: any) => (
		<div className='date-box center-item'>
			<span className='date-time'>{cellData.data.paymentPeriodType}</span>
		</div>
	);
	const statusCellTemplate = (cellData: any) => {
		const isExpired = (cell: any) => {
			return (
				cell.data.statusCode === "A" &&
				cell.data.paymentPeriodType !== "LifeTime" &&
				cell.data.endDate &&
				moment(cell.data.endDate).diff(moment(), "minutes") <= 0
			);
		};
		return (
			<div
				className={`status-sub ${
					isExpired(cellData) ? "E" : cellData?.value
				} center-item`}
			>
				{cellData.value === "A"
					? isExpired(cellData)
						? "Expired"
						: "Active"
					: cellData.data.status}
			</div>
		);
	};

	const ActionCellTemplate = (cellData: any) => {
		const [open, setOpen] = useState<boolean>(false);
		return (
			<div className='center-item'>
				{cellData.data.statusCode === "A" && (
					<div className='product-icon relative cursor-pointer'>
						<Image
							width={18}
							height={18}
							src='/images/icon/editIcon.svg'
							alt='Product'
							id={`product${cellData.data.id}`}
							onClick={() => {
								setOpen(true);
								setSelectedCell(cellData.data.id);
							}}
						/>
						{open && (
							<Tooltip
								target={`#product${cellData.data.id}`}
								showEvent='click'
								hideEvent=''
								hideOnOutsideClick={true}
							>
								<div
									className='h-full w-full cursor-pointer text-sm'
									onClick={() => {
										setCancelModal(true);
										setOpen(false);
									}}
								>
									Cancel
								</div>
							</Tooltip>
						)}
					</div>
				)}
			</div>
		);
	};
	const CancelSubscription = ({ onClose }: any) => {
		const [cancelationReason, setCancelationReason] = useState<string>();
		const changeCancelationReason = (
			e: React.ChangeEvent<HTMLInputElement>
		) => {
			setCancelationReason(e.target.value);
		};
		return (
			<div className='flex  w-[400px] flex-col gap-4'>
				<h1 className='text-xl dark:text-white'>
					Are you sure you want to cancel subscription?
				</h1>
				<div>
					<input
						type='text'
						placeholder='Cancellation reason'
						value={cancelationReason}
						name='link'
						onChange={changeCancelationReason}
						className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
					/>
				</div>
				<div className='mt-2 flex justify-center gap-2 pt-2'>
					<button
						className='mr-4 rounded-lg border border-solid bg-white px-4 py-2 text-black hover:bg-gray-200'
						onClick={() => onClose()}
					>
						Cancel
					</button>
					<Button
						height='40px'
						onClick={() =>
							userSubscriptionCancel(
								{
									cancelationReason,
									subscriptionId: selectedCell,
								},
								onClose
							)
						}
						className='!w-[100px]'
						disabled={false}
					>
						Yes
					</Button>
				</div>
			</div>
		);
	};
	const imageTemplate = (cellData: any) => (
		<div className='product-icon center-item'>
			<Image
				width={64}
				height={64}
				src={cellData.data.productThumbnailUrl || "images/product.png"}
				alt='Product'
			/>
		</div>
	);
	useEffect(() => {
		getSubscriptionHistory(setSubscriptionHistory);
	}, []);
	return (
		<div className='payment-subscription-modal w-full px-[85px] py-5'>
			<DataGrid
				dataSource={subscriptionHistory}
				height='95%'
				showBorders={true}
				columnAutoWidth={true}
				allowColumnReordering={false}
				allowColumnResizing={false}
				className={`${
					theme === "dark" ? "datagridTableDarkSubscription" : ""
				} `}
			>
				<Scrolling mode='infinite' />
				<Pager visible={false} />

				<Column caption='' width={80} cellRender={imageTemplate} />
				<Column
					dataField='productName'
					caption='PRODUCT NAME'
					cellRender={nameTimeTemplate}
				/>
				<Column
					dataField='paymentPeriodType'
					caption='PAYMENT PERIOD'
					cellRender={paymentPeriodTypeTemplate}
				/>
				<Column
					dataField='trialEndDate'
					caption='TRIAL AND DATE'
					cellRender={dateTimeTemplate}
				/>
				<Column
					dataField='statusCode'
					caption='STATUS'
					width={100}
					allowResizing={false}
					cellRender={statusCellTemplate}
				/>
				<Column
					dataField='endDate'
					caption='END DATE'
					width={100}
					allowResizing={false}
					cellRender={dateTimeTemplate}
					cssClass='tabular'
				/>
				{hasManagePaymentsPermission && (
					<Column caption='LAST PAYMENT HEADER' width={200} />
				)}
				<Column
					alignment='center'
					width={50}
					allowResizing={false}
					cellRender={ActionCellTemplate}
				/>
			</DataGrid>
			{cancelModal && (
				<CustomModal
					title=''
					onClose={() => setCancelModal(false)}
					content={<CancelSubscription onClose={() => setCancelModal(false)} />}
				/>
			)}
		</div>
	);
};
