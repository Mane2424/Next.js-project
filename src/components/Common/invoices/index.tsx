"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Common/Dashboard/Button";
import Image from "next/image";
import DataGrid, {
	Column,
	DataGridTypes,
	ColumnFixing,
	Pager,
	Paging,
	Selection,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import { SettingsIcon } from "@/components/Common/invoices/SettingsIcon";
import ResponsiveEmbed from "react-responsive-embed";
import { InvoiceFields } from "@/types/invoices";
import { InvoiceStatus } from "@/types/appEnums";
import { StatusCell } from "@/components/Common/invoices/StatusCell";
import { DateCell } from "@/components/Common/invoices/DateCell";
import { DueDateCell } from "@/components/Common/invoices/DueDateCell";
import { AmountCell } from "@/components/Common/invoices/AmountCell";
import { InvoiceCell } from "@/components/Common/invoices/InvoiceCell";
import "@/styles/invoices.scss";
import { generatePdf } from "@/utils/getPdfFile";
import ContentLoader from "@/components/Common/ContentLoader";
import { useTheme } from "next-themes";

const filterConditions = [
	{ [InvoiceFields.Status]: { ne: InvoiceStatus.Draft } },
	{ [InvoiceFields.Status]: { ne: InvoiceStatus.Canceled } },
];
const odataQueryString = `?$filter=${encodeURIComponent(
	`((${filterConditions
		.map(
			(condition) =>
				`(${Object.entries(condition)
					.map(([key, value]) => `${key} ne '${value["ne"]}'`)
					.join(" and ")})`
		)
		.join(" and ")}))`
)}`;

const InvoicesPage = () => {
	const [dataSourceOptions, setDataSourceOptions] = useState<any>([]);
	const [selectedOrgUnitId] = useState(undefined);
	const [dataLoading, setDataLoading] = useState<boolean>(false);
	const [pdfFile, setPdfFile] = useState<string>("");
	const { theme } = useTheme();
	const gridRef = useRef<any>(null);

	const getDataSource = () => {
		const dataSource = new DataSource({
			paginate: false,
			sort: [{ selector: "Date", desc: true }],
			requireTotalCount: true,
			store: new ODataStore({
				version: 4,
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/odata/UserInvoices${odataQueryString}`,
				beforeSend(request) {
					setDataLoading(true);
					request.headers["Authorization"] =
						"Bearer " + localStorage.getItem("accessToken");
					request.timeout = 1000 * 60 * 3;
				},
				onLoading: () => {},
				onLoaded: async (data: any) => {
					if (data && data.length) {
						await generatePdf(data[0]?.Id, selectedOrgUnitId, setPdfFile);
					}
					setDataLoading(false);
				},
				errorHandler: () => {},
			}),
		});
		dataSource.load().then((data) => setDataSourceOptions(data));
	};
	const onRowClick = (event: any) => {
		generatePdf(event.data.Id, selectedOrgUnitId, setPdfFile);
	};
	const refresh = () => {
		getDataSource();
	};
	const onContentReady = (e: DataGridTypes.ContentReadyEvent) => {
		if (!e.component.getSelectedRowKeys().length) {
			e.component.selectRowsByIndexes([0]);
		}
	};
	useEffect(() => {
		getDataSource();
	}, []);
	return (
		<div>
			<div className='flex h-[85px] items-center justify-between gap-2 px-7.5'>
				<div className=''>
					<h1 className='text-[24px] font-bold text-black dark:text-white'>
						Invoices
					</h1>
				</div>
				<div className='w-[50px]'>
					<Button
						height='50px'
						onClick={() => refresh()}
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
			{dataSourceOptions?.length === 0 ? (
				<div className='flex h-[calc(100vh-175px)] w-full items-center justify-center bg-white dark:bg-gray-dark dark:text-white'>
					<div className='flex flex-col items-center justify-center'>
						<Image
							src='/images/no-data-icon.png'
							width={141}
							height={141}
							alt='NoData'
						/>
						<h3 className='mt-6 text-[24px] font-semibold text-[#202b35] dark:text-white'>
							No available data
						</h3>
					</div>
				</div>
			) : dataLoading ? (
				<div className='table_body_invoices'>
					<ContentLoader />
				</div>
			) : (
				<div className='grid grid-cols-2'>
					<div>
						<DataGrid
							ref={gridRef}
							dataSource={dataSourceOptions}
							showBorders={false}
							showRowLines={true}
							showColumnLines={false}
							columnAutoWidth
							allowColumnReordering
							rowAlternationEnabled={false}
							renderAsync
							onRowClick={onRowClick}
							hoverStateEnabled
							onContentReady={onContentReady}
							className={`table_body_invoices ${
								theme === "dark" ? "datagridTableDark" : ""
							} `}
						>
							<ColumnFixing enabled={false} />
							<Selection mode='single' />
							<Column
								width='50px'
								key={"Settings"}
								alignment='center'
								caption='1346'
								headerCellRender={SettingsIcon}
								cellRender={SettingsIcon}
							/>
							<Column
								key='Id'
								dataField='Id'
								caption='INVOICE'
								dataType='string'
								visible
								cellRender={InvoiceCell}
								alignment='center'
								width='15%'
							/>
							<Column
								key='Amount'
								dataField='Amount'
								caption='AMOUNT'
								dataType='string'
								visible
								cellRender={AmountCell}
								alignment='center'
								width='15%'
							/>
							<Column
								key='Status'
								dataField='Status'
								caption='STATUS'
								dataType='string'
								visible
								cellRender={StatusCell}
								alignment='center'
							/>
							<Column
								key='Date'
								dataField='Date'
								caption='DATE'
								dataType='string'
								visible
								cellRender={DateCell}
								alignment='center'
								width='23%'
							/>
							<Column
								key='DueDate'
								dataField='DueDate'
								caption='DUE DATE'
								dataType='string'
								visible
								cellRender={DueDateCell}
								alignment='center'
								width='23%'
							/>
							<Pager
								allowedPageSizes={[10, 20, 50, 100]}
								showPageSizeSelector={true}
								visible
							/>
							<Paging defaultPageSize={20} />
						</DataGrid>
					</div>
					{pdfFile === "" ? (
						<div className='h-full w-full'>
							<ContentLoader />
						</div>
					) : (
						<div className='fstx border-style flex !h-[calc(100vh-175px)] w-full items-center justify-center'>
							<ResponsiveEmbed
								src={`data:application/pdf;base64,${pdfFile}`}
								ratio='5:3'
								className='h-full'
								loading='eager'
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default InvoicesPage;
