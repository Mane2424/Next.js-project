import React, { useEffect, useRef, useState } from "react";
import {
	DataGrid,
	Column,
	Summary,
	TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import { getLedger } from "@/services/blob.service";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import {
	addAmountsWidget,
	addTableBorders,
	addTableHeader,
	addMergedColumnLeftBorder,
	getFileName,
} from "@/utils/exel";
import saveAs from "file-saver";
import axios from "axios";
import { useTheme } from "next-themes";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import {
	CommissionLedgerEntryType,
	ICommissionLedgerEntryInfo,
} from "@/types/referral";

const dateFormat = "MMM-dd-yyyy E";
const startDate: moment.Moment = moment("2020-06-01 00:00:00");
const currencyFormatElem = {
	type: "currency",
	precision: 2,
	currency: "USD",
};

export const PendingTransactionsGrid = () => {
	const { theme } = useTheme();

	const [ledger, setLedger] = useState<any>();
	const [pendingCommissions, setPendingCommissions] = useState<
		ICommissionLedgerEntryInfo[]
	>([]);
	const [approvedCommissions, setApprovedCommissions] = useState<
		ICommissionLedgerEntryInfo[]
	>([]);
	const pendingTransactionsGrid = useRef<any>(null);
	const transactionsGrid = useRef<any>(null);
	const [ledgerTotals, setLedgerTotals] = useState<any>(undefined);
	const [pendingEarningsTotal, setPendingEarningsTotal] = useState(0);
	const [pendingWithdrawalsTotal, setPendingWithdrawalsTotal] = useState(0);
	const [earningsTotal, setEarningsTotal] = useState(0);
	const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);
	const getFormattedStartDate = () => "May-31-2020 Sun";
	const emptyText = () => "";
	const onCellPrepared = (e: any) => {
		if (e.rowType === "totalFooter") {
			if (e.columnIndex === 1) {
				e.cellElement.colSpan = 2;
			} else if (e.columnIndex === 2) {
				e.cellElement.style.display = "none";
			}
		}
	};
	const currencyFormat = (num: any) => {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};
	const onRowPrepared = (e: any) => {
		if (
			e.data &&
			(e.data.status === "Approved" ||
				e.data.status === "Starting-Balance" ||
				e.data.status === "Total-Earnings" ||
				e.data.status === "Total-Withdrawals")
		) {
			e.rowElement.classList.add(e.data.status.toLowerCase());
		}
	};
	const getLedgerTotals = async () => {
		const axiosApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await axiosApi.get(
			"/api/services/CRM/UserCommission/GetTotals"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				setLedgerTotals(resultData.result);
			})
			.catch(() => {
				setLedgerTotals(undefined);
			});
	};
	const customizeExportCell = (
		options: { gridCell?: any; excelCell?: any },
		color?: string
	) => {
		const { gridCell, excelCell } = options;
		if (gridCell.rowType === "header") {
			excelCell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: color || "F2F2F2" },
			};
			if (gridCell.column["hasColumns"]) {
				excelCell.alignment = { horizontal: "right" };
				if (
					gridCell.column.caption &&
					gridCell.column.cssClass.indexOf("amount") >= 0
				) {
					excelCell.numFmt = `$`;
					excelCell.value = +gridCell.column.caption.replace(/[^0-9.-]+/g, "");
				}
			}
		}
		if (gridCell.column.cssClass.indexOf("amount") >= 0) {
			excelCell.numFmt = `$`;
		}
	};
	const customizeStartingBalance = () =>
		ledger &&
		currencyFormat(
			ledger?.startingEarningsBalance + ledger?.startingWithdrawalsBalance
		);
	const customizeStartingEarnings = () =>
		ledger && currencyFormat(ledger.startingEarningsBalance);

	const customizeStartingWithdrawals = () =>
		ledger && currencyFormat(ledger.startingWithdrawalsBalance);

	const calculateWithdrawalAmount = (
		commissionLedgerInfo: ICommissionLedgerEntryInfo
	) => {
		return commissionLedgerInfo?.type === CommissionLedgerEntryType.Withdrawal
			? commissionLedgerInfo?.totalAmount
			: (commissionLedgerInfo?.status as any) == "Total-Withdrawals"
				? 0
				: null;
	};
	const calculateDescriptionValue = (
		commissionLedgerInfo: ICommissionLedgerEntryInfo
	) => {
		let description: string = commissionLedgerInfo.type;
		if (commissionLedgerInfo?.paymentSystem) {
			description += " (" + commissionLedgerInfo?.paymentSystem + ")";
		} else {
			const startDate: string = commissionLedgerInfo.startDate
				? commissionLedgerInfo?.startDate?.format("MM/DD")
				: "";
			const endDate: string = commissionLedgerInfo.endDate
				? commissionLedgerInfo?.endDate?.format("MM/DD")
				: "";
			const date: string =
				startDate === endDate
					? startDate
					: startDate + (startDate && endDate ? "-" : "") + endDate;
			description += " " + date;
		}
		return description;
	};
	const calculateEarningsAmount = (
		commissionLedgerInfo: ICommissionLedgerEntryInfo
	) => {
		return commissionLedgerInfo?.type === CommissionLedgerEntryType.Earning
			? commissionLedgerInfo?.totalAmount
			: (commissionLedgerInfo?.status as any) == "Total-Earnings"
				? 0
				: null;
	};
	const calculateStatusValue = (
		commissionLedgerInfo: ICommissionLedgerEntryInfo
	) => {
		const status: any = commissionLedgerInfo?.status;
		return status === "Starting-Balance" ||
			status === "Total-Earnings" ||
			status === "Total-Withdrawals"
			? ""
			: commissionLedgerInfo?.status;
	};
	const approvedEarningsTotal = (): number => {
		return earningsTotal + (ledger && ledger.startingEarningsBalance);
	};
	const approvedWithdrawalsTotal = (): number => {
		return withdrawalsTotal + (ledger && ledger.startingWithdrawalsBalance);
	};
	const copy = (value: string) => {
		navigator.clipboard.writeText(value);
	};
	const TextTemplate = ({ value }: any) => {
		return (
			<div className='text-template'>
				<span>{value}</span>

				<Image
					src={"/images/icon/copy.svg"}
					height={20}
					width={20}
					alt='copy'
					onClick={() => copy(value)}
					className='save-to-clipboard'
				/>
			</div>
		);
	};
	const CurrencyTemplate = ({ value }: any) => {
		if (!value) return <span>{value}</span>;
		return (
			<div className='text-template'>
				<span>{currencyFormat(+value)}</span>

				<Image
					src={"/images/icon/copy.svg"}
					height={20}
					width={20}
					alt='copy'
					onClick={() => copy(value)}
					className='save-to-clipboard'
				/>
			</div>
		);
	};
	const DateCellTemplate = (cellData: any) => (
		<div className='date-template'>
			<span>{formatDate(cellData.value)}</span>
			<Image
				src={"/images/icon/copy.svg"}
				height={20}
				width={20}
				alt='copy'
				onClick={() => copy(formatDate(cellData.value))}
				className='save-to-clipboard'
			/>
		</div>
	);
	const downloadReport = () => {
		const workBook = new Workbook();
		const worksheet = workBook.addWorksheet("Payout Ledger History", {
			properties: { defaultRowHeight: 26 },
			views: [{ showGridLines: false, state: "normal" }],
		});
		exportDataGrid({
			component: pendingTransactionsGrid.current
				? pendingTransactionsGrid.current.instance
				: undefined,
			worksheet: worksheet,
			topLeftCell: { row: 8, column: 2 },
			loadPanel: { enabled: false },
			keepColumnWidths: true,
			autoFilterEnabled: false,
			customizeCell: (options) => customizeExportCell(options),
		})
			.then((cellRange: any) => {
				addTableHeader(worksheet, "YOUR PAYOUT LEDGER HISTORY");
				addAmountsWidget(worksheet, "e2efda", 2, "TOTAL AMOUNTS POSTED", [
					{
						name: "Earned",
						value: ledgerTotals?.earnedAmount,
					},
					{
						name: "Withdrawn",
						value: ledgerTotals?.withdrawnAmount,
					},
				]);
				addAmountsWidget(worksheet, "fff2cc", 5, "PENDING AMOUNTS", [
					{
						name: "Earned",
						value: ledgerTotals?.pendingEarningsAmount,
					},
					{
						name: "Withdrawn",
						value: ledgerTotals?.pendingWithdrawalsAmount,
					},
				]);
				addAmountsWidget(worksheet, "c6e0b4", 7, "AVAILABLE", [
					{
						name: "Balance",
						value: ledgerTotals?.availableBalance,
					},
				]);
				addTableBorders(worksheet, cellRange, 2);
				addMergedColumnLeftBorder(worksheet, cellRange);
				return exportDataGrid({
					worksheet: worksheet,
					component: transactionsGrid.current
						? transactionsGrid.current.instance
						: undefined,
					topLeftCell: { row: cellRange.to.row + 2, column: 2 },
					loadPanel: { enabled: false },
					keepColumnWidths: true,
					autoFilterEnabled: false,
					customizeCell: (options: { gridCell?: any; excelCell?: any }) =>
						customizeExportCell(options, "E2EFDA"),
				}).then((cellRange: any) => {
					addTableBorders(worksheet, cellRange, 2);
					addMergedColumnLeftBorder(worksheet, cellRange);
				});
			})
			.then(() => {
				workBook.xlsx.writeBuffer().then((buffer: BlobPart) => {
					saveAs(
						new Blob([buffer], {
							type: "application/octet-stream",
						}),
						getFileName("Ledger")
					);
				});
			});
	};
	useEffect(() => {
		getLedger(startDate, setLedger);
		getLedgerTotals();
	}, []);
	useEffect(() => {
		if (ledger?.entries?.length) {
			let balance = 0;
			const pending: ICommissionLedgerEntryInfo[] = [];
			const approved: ICommissionLedgerEntryInfo[] = [];
			let pendingEarnings = 0;
			let pendingWithdrawals = 0;
			let earnings = 0;
			let withdrawals = 0;

			ledger.entries
				.sort(
					(
						entryA: ICommissionLedgerEntryInfo,
						entryB: ICommissionLedgerEntryInfo
					) => (moment(entryA.date).isAfter(entryB.date) ? 1 : -1)
				)
				.forEach((commissionLedgerInfo: ICommissionLedgerEntryInfo) => {
					if (commissionLedgerInfo.status === "Pending") {
						// Replace with appropriate enum or constant
						pending.unshift(commissionLedgerInfo);
						if (commissionLedgerInfo.totalAmount > 0) {
							pendingEarnings += commissionLedgerInfo.totalAmount;
						} else {
							pendingWithdrawals += commissionLedgerInfo.totalAmount;
						}
					} else {
						commissionLedgerInfo.balance = balance +=
							commissionLedgerInfo.totalAmount;
						approved.unshift(commissionLedgerInfo);
						if (commissionLedgerInfo.totalAmount > 0) {
							earnings += commissionLedgerInfo.totalAmount;
						} else {
							withdrawals += commissionLedgerInfo.totalAmount;
						}
					}
				});

			// Increment balance with pending balances
			for (let i = pending.length - 1; i >= 0; i--) {
				pending[i].balance = balance += pending[i].totalAmount;
			}

			setPendingCommissions(pending);
			setApprovedCommissions(approved);
			setPendingEarningsTotal(pendingEarnings);
			setPendingWithdrawalsTotal(pendingWithdrawals);
			setEarningsTotal(earnings);
			setWithdrawalsTotal(withdrawals);
		}
	}, [ledger?.entries]);
	return (
		<div className='flex flex-col gap-5'>
			<div className='flex w-full items-center justify-between'>
				<h1 className='text-[21px] font-extrabold text-[#212529] dark:!text-white'>
					YOUR PAYOUT LEDGER HISTORY
				</h1>
				<button
					onClick={() => {
						downloadReport();
					}}
					className='color-black text-sm dark:!text-white'
				>
					Download the report
				</button>
			</div>
			<div className='pending_commissions_table'>
				<DataGrid
					dataSource={pendingCommissions}
					showBorders={true}
					onRowPrepared={onRowPrepared}
					allowColumnReordering={false}
					ref={pendingTransactionsGrid}
					className={` ${
						theme === "dark" ? "datagrid-table-dark-pendingcommission" : ""
					} `}
				>
					<Column
						alignment='right'
						caption='Total including pending amounts:'
						cssClass='clipboard-holder'
					>
						<Column
							dataField='date'
							dataType='date'
							format={dateFormat}
							allowSorting={false}
							cssClass='colorful tabular clipboard-holder'
							cellRender={DateCellTemplate}
						/>
						<Column
							dataField='type'
							allowSorting={false}
							calculateCellValue={calculateDescriptionValue}
							cssClass='colorful clipboard-holder'
							cellRender={TextTemplate}
						/>
						<Column
							dataField='status'
							cssClass='colorful clipboard-holder'
							calculateCellValue={calculateStatusValue}
							allowSorting={false}
							cellRender={TextTemplate}
						/>
					</Column>
					<Column
						alignment='right'
						name='pendingEarningsTotal'
						caption={currencyFormat(
							pendingEarningsTotal + approvedEarningsTotal()
						)}
						cssClass='clipboard-holder amount'
					>
						<Column
							caption='Earnings'
							dataField='totalAmount'
							alignment='right'
							cssClass='clipboard-holder amount'
							allowSorting={false}
							format={currencyFormat}
							calculateCellValue={calculateEarningsAmount}
							cellRender={CurrencyTemplate}
						/>
					</Column>
					<Column
						alignment='right'
						caption={currencyFormat(
							pendingWithdrawalsTotal + approvedWithdrawalsTotal()
						)}
						cssClass='clipboard-holder amount'
					>
						<Column
							caption='Withdrawal'
							cssClass='withdrawalAmount clipboard-holder amount'
							alignment='right'
							format={currencyFormat}
							calculateCellValue={calculateWithdrawalAmount}
							allowSorting={false}
							cellRender={CurrencyTemplate}
						/>
					</Column>
					<Column
						alignment='right'
						caption={currencyFormat(
							pendingEarningsTotal +
								pendingWithdrawalsTotal +
								approvedEarningsTotal() +
								approvedWithdrawalsTotal()
						)}
						cssClass='clipboard-holder amount'
					>
						<Column
							dataField='balance'
							alignment='right'
							cssClass='clipboard-holder amount-column amount'
							allowSorting={false}
							format={currencyFormat}
							cellRender={CurrencyTemplate}
						/>
					</Column>
				</DataGrid>
			</div>
			<div className='approved_commissions_table'>
				<DataGrid
					dataSource={approvedCommissions}
					showBorders={true}
					allowColumnReordering={false}
					onRowPrepared={onRowPrepared}
					onCellPrepared={onCellPrepared}
					ref={transactionsGrid}
					className={` ${
						theme === "dark" ? "datagrid-table-dark-approvedcommission" : ""
					} `}
				>
					<Column
						alignment='right'
						caption='Total amounts posted in your account:'
						cssClass='clipboard-holder'
					>
						<Column
							dataField='date'
							allowSorting={false}
							format={dateFormat}
							dataType='date'
							cssClass='colorful clipboard-holder'
						/>
						<Column
							dataField='type'
							allowSorting={false}
							calculateCellValue={calculateDescriptionValue}
							cssClass='colorful clipboard-holder'
						/>
						<Column
							dataField='status'
							allowSorting={false}
							calculateCellValue={calculateStatusValue}
							cssClass='colorful clipboard-holder'
						/>
					</Column>
					<Column
						alignment='right'
						caption={currencyFormat(approvedEarningsTotal())}
						cssClass='clipboard-holder amount'
					>
						<Column
							caption='Earned'
							dataField='earningsAmount'
							alignment='right'
							cssClass='clipboard-holder amount'
							allowSorting={false}
							format={currencyFormatElem}
							calculateCellValue={calculateEarningsAmount}
						/>
					</Column>
					<Column
						alignment='right'
						caption={currencyFormat(approvedWithdrawalsTotal())}
						cssClass='clipboard-holder amount'
					>
						<Column
							caption='Withdrawn'
							dataField='withdrawalAmount'
							cssClass='withdrawalAmount clipboard-holder amount'
							alignment='right'
							allowSorting={false}
							format={currencyFormatElem}
							calculateCellValue={calculateWithdrawalAmount}
						/>
					</Column>
					<Column
						alignment='right'
						caption={currencyFormat(
							approvedEarningsTotal() + approvedWithdrawalsTotal()
						)}
						cssClass='clipboard-holder amount'
					>
						<Column
							dataField='balance'
							alignment='right'
							cssClass='clipboard-holder amount'
							allowSorting={false}
							format={currencyFormatElem}
						/>
					</Column>
					<Summary>
						<TotalItem
							column='date'
							customizeText={getFormattedStartDate}
							displayFormat='{0}'
						/>
						<TotalItem column='type' displayFormat='Starting Balance' />
						<TotalItem
							column='earningsAmount'
							customizeText={emptyText}
							displayFormat='{0}'
						/>
						<TotalItem
							column='withdrawalAmount'
							customizeText={emptyText}
							displayFormat='{0}'
						/>
						<TotalItem
							column='balance'
							cssClass='amount'
							customizeText={customizeStartingBalance}
							displayFormat='{0}'
						/>
						<TotalItem
							column='date'
							customizeText={getFormattedStartDate}
							displayFormat='{0}'
						/>
						<TotalItem
							column='type'
							displayFormat='Total Withdrawals (Historical)'
						/>
						<TotalItem
							column='earningsAmount'
							customizeText={emptyText}
							displayFormat='{0}'
						/>
						<TotalItem
							column='withdrawalAmount'
							cssClass='amount'
							customizeText={customizeStartingWithdrawals}
							displayFormat='{0}'
						/>
						<TotalItem
							column='balance'
							customizeText={emptyText}
							displayFormat='{0}'
						/>
						<TotalItem
							column='date'
							customizeText={getFormattedStartDate}
							displayFormat='{0}'
						/>
						<TotalItem
							column='type'
							displayFormat='Total Earnings (Historical)'
						/>
						<TotalItem
							column='earningsAmount'
							cssClass='amount'
							customizeText={customizeStartingEarnings}
							displayFormat='{0}'
						/>
					</Summary>
				</DataGrid>
			</div>
		</div>
	);
};
