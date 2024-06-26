import React, { useEffect, useRef, useState } from "react";
import DataGrid, {
	Column,
	GroupPanel,
	Sorting,
	Pager,
	Paging,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import "@/styles/refferalPageCommissions.scss";
import { CommissionFields } from "@/types/referralPortal";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import saveAs from "file-saver";
import {
	addAmountsWidget,
	addTableBorders,
	addTableHeader,
	getFileName,
} from "@/utils/exel";
import axios from "axios";
import { useTheme } from "next-themes";
const filterConditions = [{ CurrencyId: { eq: "$" } }];
const odataQueryString = `?$filter=${encodeURIComponent(
	`((${filterConditions
		.map(
			(condition) =>
				`(${Object.entries(condition)
					.map(([key, value]: any) => `${key} ne '${value["ne"]}'`)
					.join(" and ")})`
		)
		.join(" and ")}))`
)}`;
export const CommissionHistory = () => {
	const { theme } = useTheme();
	const [dataSourceOptions, setDataSourceOptions] = useState<any>([]);
	const [ledgerTotals, setLedgerTotals] = useState<any>(undefined);
	const dataGridRef = useRef<any>(null);
	const getDataSource = () => {
		const dataSource = new DataSource({
			requireTotalCount: true,
			store: new ODataStore({
				version: 4,
				key: CommissionFields.Id,
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/odata/UserCommissions${odataQueryString}`,
				beforeSend(request) {
					request.headers["Authorization"] =
						"Bearer " + localStorage.getItem("accessToken");
					request.timeout = 1000 * 60 * 3;
				},
				onLoading: () => {},
				onLoaded: async () => {},
				errorHandler: () => {},
			}),
		});
		dataSource.load().then((data) => setDataSourceOptions(data));
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
	const amountCellTemplate = (cellData: any) => (
		<div className='amount-template'>
			<div>
				<span
					className='amountCell'
					style={{
						color:
							cellData?.column?.dataField === CommissionFields?.CommissionAmount
								? getCellColor(cellData.data)
								: "",
					}}
				>
					{cellData.value &&
						new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(cellData.value)}
				</span>
			</div>
			<Image
				src={"/images/icon/copy.svg"}
				height={20}
				width={20}
				alt='copy'
				onClick={() => copy(cellData.value)}
				className='save-to-clipboard'
			/>
		</div>
	);

	const statusCellTemplate = (cellData: any) => (
		<div className='status-template'>
			<span style={{ color: getCellColor(cellData.data) }}>
				{cellData.value}
			</span>
			<Image
				src={"/images/icon/copy.svg"}
				height={20}
				width={20}
				alt='copy'
				onClick={() => copy(cellData.value)}
				className='save-to-clipboard'
			/>
		</div>
	);

	const tierCellTemplate = (cellData: any) => (
		<div className='tier-template'>
			<span>{cellData.value}</span>
			<Image
				src={"/images/icon/copy.svg"}
				height={20}
				width={20}
				alt='copy'
				onClick={() => copy(cellData.value)}
				className='save-to-clipboard'
			/>
		</div>
	);
	const dateCellTemplate = (cellData: any) => (
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

	const getCellColor = (data: any) => {
		return data.Status === "Approved" ? "#38bd6c" : "#d16a39";
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
	const downloadReport = () => {
		const workBook = new Workbook();
		const worksheet = workBook.addWorksheet("Commission History", {
			properties: { defaultRowHeight: 26 },
			views: [{ showGridLines: false }],
		});
		exportDataGrid({
			component: dataGridRef.current ? dataGridRef.current.instance : undefined,
			worksheet: worksheet,
			topLeftCell: { row: 8, column: 2 },
			loadPanel: { enabled: false },
			keepColumnWidths: true,
			autoFilterEnabled: true,
			customizeCell: (options) => {
				const { gridCell, excelCell } = options;
				if (gridCell?.rowType === "header") {
					excelCell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "F2F2F2" },
					};
				} else if (
					gridCell?.column?.dataField === CommissionFields.CommissionAmount ||
					gridCell?.column?.dataField === CommissionFields.Status
				) {
					excelCell.font = {
						color: {
							argb: getCellColor(gridCell.data).slice(1),
						},
					};
				}
				if (gridCell?.rowType === "data") {
					if (gridCell?.column?.dataField === CommissionFields.Id) {
						excelCell.numFmt = "0";
					} else if (gridCell?.column?.cellTemplate === "amountCell") {
						excelCell.numFmt = `"$"#,##0.00;[Red]("$"#,##0.00)`;
					}
				}
			},
		})
			.then((cellRange: any) => {
				addTableHeader(worksheet, "YOUR COMMISSION TRANSACTION HISTORY");
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
				addAmountsWidget(worksheet, "c6e0b4", 8, "AVAILABLE", [
					{
						name: "Balance",
						value: ledgerTotals?.availableBalance,
					},
				]);
				/** Increase width of C2 column */
				worksheet.getColumn(3).width = 20;
				addTableBorders(worksheet, cellRange);
			})
			.then(() => {
				workBook.xlsx.writeBuffer().then((buffer: BlobPart) => {
					saveAs(
						new Blob([buffer], {
							type: "application/octet-stream",
						}),
						getFileName("Commission-history")
					);
				});
			});
	};
	useEffect(() => {
		getDataSource();
		getLedgerTotals();
	}, []);

	return (
		<div className='gridCommission'>
			<header>
				<h1 className='dark:!text-white'>
					{"Your commission transaction history"}
				</h1>
				<button onClick={() => downloadReport()}>
					{"Download the report"}
				</button>
			</header>
			<div className='grid-data-table-commission'>
				<DataGrid
					ref={dataGridRef}
					className={`commission-history-grid main-component-view limitedPagerTotal ${
						theme === "dark" ? "datagrid-table-dark-commission" : ""
					} `}
					accessKey='narrowHeaderPanel'
					noDataText={"No Transaction History"}
					renderAsync={true}
					allowColumnReordering={true}
					columnAutoWidth={true}
					dataSource={dataSourceOptions}
					allowColumnResizing={true}
					hoverStateEnabled={true}
					showBorders={true}
					loadPanel={{ enabled: false }}
					remoteOperations={{
						filtering: false,
						grouping: true,
						groupPaging: true,
						paging: true,
						sorting: true,
						summary: true,
					}}
					pager={{
						showPageSizeSelector: true,
						allowedPageSizes: [10, 20, 50, 100],
						showInfo: true,
						visible: true,
					}}
					// onClick={onGridClick}
				>
					<GroupPanel visible={true} />
					<Sorting mode='multiple' />
					<Column
						dataField={CommissionFields?.OrderDate}
						caption={"Order Date"}
						dataType='date'
						sortOrder='desc'
						cssClass='orderDate'
						cellRender={dateCellTemplate}
					/>
					<Column
						dataField={CommissionFields?.OrderNumber}
						alignment='left'
						width={100}
						caption={"Order Id"}
						cellRender={TextTemplate}
						cssClass='orderNumber'
					/>
					<Column
						dataField={CommissionFields?.CustomerName}
						caption={"Customer Name"}
						cellRender={TextTemplate}
						cssClass='customerName'
					/>
					<Column
						dataField={CommissionFields?.ProductName}
						caption={"Product Name"}
						cellRender={TextTemplate}
						width={150}
						cssClass='productName'
					/>
					<Column
						dataField={CommissionFields?.ProductAmount}
						caption={"Sale Amount"}
						cellRender={amountCellTemplate}
						width={185}
						cssClass='productAmount'
					/>
					<Column
						dataField={CommissionFields?.Tier}
						caption={"Tier"}
						cellRender={tierCellTemplate}
						width={70}
						cssClass='tier'
					/>
					<Column
						dataField={CommissionFields?.CommissionAmount}
						caption={"Commission"}
						cellRender={amountCellTemplate}
						width={185}
						cssClass='commissionAmount'
					/>
					<Column
						dataField={CommissionFields?.Status}
						caption={"Status"}
						cellRender={statusCellTemplate}
						cssClass='status'
					/>
					<Pager
						allowedPageSizes={[10, 20, 50, 100]}
						showPageSizeSelector={true}
						visible
					/>
					<Paging defaultPageSize={20} />
				</DataGrid>
			</div>
		</div>
	);
};
