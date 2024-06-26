"use client";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PhotoTemplate from "@/components/Common/Leads/PhotoTemplate";
import { Button } from "@/components/Common/Dashboard/Button";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { toggleFullScreen } from "@/utils/toggleFullScreen";
import { exportDataGrid } from "devextreme/excel_exporter";
import Toolbar, { Item } from "devextreme-react/toolbar";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import { useActions } from "@/app/hooks/useActions";
import { userAccount } from "@/redux/selectors";
import { leadKeys } from "@/utils/leadKeys";
import { useAppSelector } from "@/redux";
import { saveAs } from "file-saver-es";
import { useTheme } from "next-themes";
import { Workbook } from "exceljs";
import "@/styles/leadsPage.scss";
import Image from "next/image";
import { jsPDF } from "jspdf";
import DataGrid, {
	Column,
	ColumnFixing,
	Export,
	GroupPanel,
	Grouping,
	Pager,
	Paging,
	SearchPanel,
	Selection,
} from "devextreme-react/data-grid";
import {
	DispayedComponent,
	changeFilterData,
	filterKeys,
} from "@/utils/filterKeys";
import { CloseIcon } from "../CloseIcon";
import {
	getCountries,
	getLists,
	getStages,
	getStars,
	getStates,
	getTags,
} from "@/services/blob.service";
import apiClient from "@/config/api-client";
const initialValue = {
	email: "",
	name: "",
	xref: "",
	affiliateCode: "",
	phone: "",
	city: "",
	stages: [],
	creation: { startDate: null, endDate: null },
	states: [],
	streetAddress: "",
	zipCode: "",
	Industry: "",
	Tag: [],
	List: [],
	Star: [],
	Rating: {},
};
const ReferredLeadsPage = () => {
	const [leadsCount, setLeadsCount] = useState<number | string | undefined>(
		"?"
	);
	const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
	const [currentPipeline, setCurrentPipeline] = useState<any>(undefined);
	const [selectedClient, setSelectedClient] = useState<string>("Client");
	const [openClientModal, setOpenClientModal] = useState<boolean>(false);
	const [isHoverFilter, setIsHoverFilter] = useState<boolean>(false);
	const [dataSourceOptions, setDataSourceOptions] = useState<any>();
	const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
	const [compactView, setCompactView] = useState<boolean>(false);
	const [showToolBar, setShowToolBar] = useState<boolean>(true);
	const [selectedFilter, setSelectedFilter] = useState<any>();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedStages, setSelectedStages] = useState<any>([]);
	const [selectedStates, setSelectedStates] = useState<any>([]);
	const [selectedTags, setSelectedTags] = useState<any>([]);
	const [selectedStars, setSelectedStars] = useState<any>([]);
	const [selectedLists, setSelectedList] = useState<any>([]);
	const [selectedRating, setSelectedRating] = useState<any>({});
	const [selectedTime, setSelectedTime] = useState<any>({});
	const pipelines = useAppSelector(userAccount.pipeLines);
	const settingsRef = useRef<HTMLDivElement>(null);
	const clientRef = useRef<HTMLDivElement>(null);
	const { getPipelines } = useActions();
	const filterRef = useRef(null);
	const { theme } = useTheme();
	const [filterData, setFilterData] = useState<any>(initialValue);
	const [error, setError] = useState(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, [e.target.name]: e.target.value });
	};
	const handleChangeSelect = (value: any, name: any, checked?: boolean) => {
		if (name === "stages") {
			if (selectedStages.includes(value) && !checked) {
				const selected = selectedStages.filter((elm: string) => elm !== value);
				setSelectedStages(selected);
			} else {
				setSelectedStages([...selectedStages, value]);
			}
		}
		if (name === "states") {
			if (!checked) {
				const selected: any = selectedStages.filter(
					(elm: any) => elm.CountryId !== value
				);
				setSelectedStates(selected);
			} else {
				setSelectedStates([...selectedStages, { CountryId: value }]);
			}
		}
		if (name === "Tag") {
			if (selectedTags.includes(value) && !checked) {
				const selected = selectedTags.filter((elm: string) => elm !== value);
				setSelectedTags(selected);
			} else {
				setSelectedTags([...selectedTags, value]);
			}
		}
		if (name === "List") {
			if (selectedLists.includes(value) && !checked) {
				const selected = selectedLists.filter((elm: string) => elm !== value);
				setSelectedList(selected);
			} else {
				setSelectedList([...selectedLists, value]);
			}
		}
		if (name === "Star") {
			if (selectedStars.includes(value) && !checked) {
				const selected = selectedStars.filter((elm: string) => elm !== value);
				setSelectedStars(selected);
			} else {
				setSelectedStars([...selectedStars, value]);
			}
		}
		if (name === "Rating") {
			setSelectedRating(value);
		}
	};

	const handleChangeCalendar = (value: string[]) => {
		setFilterData({
			...filterData,
			creation: { startDate: value[0], endDate: value[1] },
		});
		setSelectedTime({ startDate: value[0], endDate: value[1] });
	};
	const isSelected = (caption: string, value: any) => {
		if (caption === "creation") {
			return selectedTime.endDate;
		} else if (caption === "states") {
			return selectedStates.length;
		} else if (caption === "stages") {
			return selectedStages.length;
		} else if (caption === "Tag") {
			return selectedTags.length;
		} else if (caption === "List") {
			return selectedLists.length;
		} else if (caption === "Star") {
			return selectedStars.length;
		} else if (caption === "Rating") {
			return selectedRating.min;
		} else {
			return value;
		}
	};
	const onOutsideClickSettingsCallback = () => {
		setOpenSettingsModal(false);
	};

	const onOutsideClickClientCallback = () => {
		setOpenClientModal(false);
	};

	useOnClickOutside(settingsRef, onOutsideClickSettingsCallback);
	useOnClickOutside(clientRef, onOutsideClickClientCallback);

	const onExporting = useCallback((e: any) => {
		if (e.format === "xlsx" || e.format === "csv") {
			const workbook = new Workbook();
			const worksheet = workbook.addWorksheet("RefferedLeads");
			exportDataGrid({
				component: e.component,
				worksheet,
				autoFilterEnabled: true,
			}).then(() => {
				if (e.format === "xlsx") {
					workbook.xlsx.writeBuffer().then((buffer) => {
						saveAs(
							new Blob([buffer], { type: "application/octet-stream" }),
							"RefferedLeads.xlsx"
						);
					});
				} else {
					workbook.xlsx.writeBuffer().then((buffer) => {
						saveAs(
							new Blob([buffer], { type: "application/octet-stream" }),
							"RefferedLeads.csv"
						);
					});
				}
			});
		} else if (e.format === "pdf") {
			const doc = new jsPDF();
			exportDataGridToPdf({
				jsPDFDocument: doc,
				component: e.component,
			}).then(() => {
				doc.save("RefferedLeads.pdf");
			});
		}
	}, []);

	const getDataSource = (filter: any) => {
		const dataSource = new DataSource({
			paginate: false,
			requireTotalCount: true,
			store: new ODataStore({
				version: 4,
				url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/odata/Lead`,
				key: "Id",
				beforeSend(request) {
					setLeadsCount("?");
					request.headers["Authorization"] =
						"Bearer " + localStorage.getItem("accessToken");
					request.params.$filter = `${filter}`;
					request.params.$select = [
						"Id",
						...[
							leadKeys
								.filter((item) => item.visible)
								.map((item) => item.key)
								.join(","),
						],
					];
					request.params.$count = true;
					request.params.contactGroupId = currentPipeline?.contractGroupId;
					request.timeout = 1000 * 60 * 3;
				},
				onLoading: () => {},
				onLoaded: (data: any) => {
					setLeadsCount(data.length);
				},
				errorHandler: () => {},
			}),
		});
		dataSource.load().then((data) => {
			setDataSourceOptions(data);
		});
	};
	const getPermision = async () => {
		await apiClient
			.get("api/services/CRM/Pipeline/GetPipelineDefinitions")
			.then(() => {})
			.catch((e) => {
				setError(e?.response?.data?.error?.message);
			});
	};
	const settingsMenuData = [
		{
			title: showToolBar ? "Hide toolbar menu" : "Show toolbar menu",
			icon: (
				<Image
					src='/images/icon/toogleToolbar.svg'
					alt='toogleToolbar'
					height={20}
					width={20}
				/>
			),
			onClick: () => setShowToolBar(!showToolBar),
		},
		{
			title: compactView ? "Show normal view" : "Show compact view",
			icon: (
				<Image
					src='/images/icon/toogleCompactView.svg'
					alt='toogleCompactView'
					height={20}
					width={20}
				/>
			),
			onClick: () => setCompactView(!compactView),
		},
		{
			title: "Open page in full screen",
			icon: (
				<Image
					src='/images/icon/toogleFullScreenView.svg'
					alt='toogleFullScreenView'
					height={20}
					width={20}
				/>
			),
			onClick: toggleFullScreen,
		},
	];
	const selectedValues = (caption: string, value: any) => {
		if (caption === "creation") {
			return selectedTime;
		} else if (caption === "states") {
			return selectedStates;
		} else if (caption === "stages") {
			return selectedStages;
		} else if (caption === "Tag") {
			return selectedTags;
		} else if (caption === "List") {
			return selectedLists;
		} else if (caption === "Star") {
			return selectedStars;
		} else if (caption === "Rating") {
			return selectedRating;
		} else {
			return value;
		}
	};
	const clearData = () => {
		getDataSource(`(PipelineId eq ${currentPipeline?.id})`);
		setFilterData(initialValue);
		setSelectedTime([]);
		setSelectedStages([]);
		setSelectedStates([]);
		setSelectedTags([]);
		setSelectedStars([]);
		setSelectedList([]);
		setSelectedRating({});
	};
	const applyButtonClick = async () => {
		const filter = changeFilterData(
			filterData,
			currentPipeline?.id,
			selectedStages,
			selectedStates,
			selectedTags,
			selectedLists,
			selectedStars,
			selectedRating,
			selectedTime
		);
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/odata/Lead${filter}`;
		try {
			const response = await apiClient.get(url);
			setDataSourceOptions(response.data.value);
			setLeadsCount(response.data.value.length);
		} catch (error) {
			setDataSourceOptions([]);
			setLeadsCount(0);
		}
		setOpenModal(false);
	};
	useEffect(() => {
		setCurrentPipeline(pipelines.data?.[0]);
		if (currentPipeline?.id) {
			getDataSource(`(PipelineId eq ${currentPipeline?.id})`);
		}
	}, [pipelines]);

	useEffect(() => {
		if (currentPipeline?.id) {
			getDataSource(`(PipelineId eq ${currentPipeline?.id})`);
		}
	}, [currentPipeline]);

	useEffect(() => {
		getPermision();
		getPipelines();
		getCountries().then((res) => {
			if (res) {
				setFilterData((prev: any) => ({
					...prev,
					states: [...res],
				}));
			}
		});

		getStates();
		getStars().then((res: any) => {
			if (res) {
				setFilterData((prev: any) => ({
					...prev,
					Star: [...res],
				}));
			}
		});

		getLists().then((res: any) => {
			if (res) {
				setFilterData((prev: any) => ({
					...prev,
					List: [...res],
				}));
			}
		});

		getTags().then((res) => {
			if (res) {
				setFilterData((prev: any) => ({
					...prev,
					Tag: [...res],
				}));
			}
		});

		getStages().then((res) => {
			if (res) {
				setFilterData((prev: any) => ({
					...prev,
					stages: [...res],
				}));
			}
		});
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
	const backButtonOptions = {
		icon: "filter",
		onClick: () => {
			setIsOpenFilter(!isOpenFilter);
			setOpenModal(false);
		},
	};
	return (
		<div className='leads-page'>
			<div
				className={
					!compactView ? "table_container relative" : "table_compact_view"
				}
			>
				<div className='flex h-[74px] justify-start border-b'>
					<div
						className='relative flex h-full w-[63px] items-center justify-center'
						ref={settingsRef}
					>
						<button
							className='flex h-[42px] w-[42px] items-center justify-center rounded-full border bg-white text-gray-500'
							aria-haspopup='true'
							aria-expanded='true'
							onClick={() => setOpenSettingsModal(!openSettingsModal)}
						>
							<Image
								src='/images/icon/treeDots.svg'
								alt='treeDots'
								height={25}
								width={30}
							/>
						</button>
						{openSettingsModal && (
							<div className='absolute left-0 top-17 z-[950] mt-2 w-[270px] origin-top-right rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-dark dark:text-white'>
								<ul className='py-4'>
									{settingsMenuData.map((elem) => (
										<li
											key={elem.title}
											className='mb-4 flex h-[45px] items-center px-4'
										>
											<button
												className='flex h-[42px] w-[42px] items-center justify-center rounded-full border bg-white text-gray-500'
												onClick={() => elem.onClick?.()}
											>
												{elem.icon}
											</button>
											<span className='block text-nowrap pl-4 text-sm font-normal text-dark dark:text-white'>
												{elem.title}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className='flex w-full items-center justify-start border-l'>
						<div
							className='relative flex w-[190px] items-center justify-center'
							ref={clientRef}
						>
							<button
								className='flex w-full items-center bg-transparent px-4 py-2 text-gray-500'
								aria-haspopup='true'
								aria-expanded='true'
								onClick={() => setOpenClientModal(!openClientModal)}
							>
								{`${selectedClient} (${leadsCount})`}
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
							{openClientModal && (
								<div className='absolute left-0 top-13 z-[950] mt-2 w-full origin-top-right rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-dark dark:text-white'>
									<ul className='py-1'>
										{pipelines?.data?.map((elem: any) => (
											<li key={elem.id}>
												<button
													className='block px-4 py-2 text-sm text-dark dark:text-white'
													type='button'
													onClick={() => {
														setOpenClientModal(!openClientModal);
														setSelectedClient(elem.name);
														setCurrentPipeline(elem);
													}}
												>
													{elem.name}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
				{showToolBar && (
					<div
						className='absolute left-3 top-[85px] z-[900] w-[35px]'
						onMouseEnter={() => setIsHoverFilter(true)}
						onMouseLeave={() => {
							setIsHoverFilter(false);
						}}
					>
						<Toolbar>
							<Item
								location='before'
								widget='dxButton'
								options={backButtonOptions}
								ref={filterRef}
							/>
						</Toolbar>
						<div
							onMouseLeave={() => setIsHoverFilter(false)}
							style={{
								width: "100px",
								height: "100px",
								position: "absolute",
								top: "-34px",
								left: "-34px",
								zIndex: -1,
							}}
						></div>
					</div>
				)}
				<div className='relative flex border-t-[1px] border-[#e5e7eb] bg-white'>
					{showToolBar && (
						<div
							onMouseEnter={() => {
								setIsHoverFilter(true);
							}}
							onMouseLeave={() => {
								setIsHoverFilter(false);
								if (!isOpenFilter) {
									setOpenModal(false);
								}
							}}
							style={{
								width: isOpenFilter || isHoverFilter ? "400px" : "0",
								height: "calc(100vh - 225px)",
								background: "white",
								transition: "1s",
								top: "57px",
								position: "absolute",
								zIndex: 900,
								overflow: "hidden",
								border:
									isOpenFilter || isHoverFilter ? "1px solid #dfdfdf" : "none",
							}}
						>
							<div className='h-full w-full pb-[15px] pl-5 pt-[13px] dark:bg-gray-dark dark:text-white'>
								<div className=''>
									<div className='flex items-center justify-between pr-4'>
										<h3 className='font-medium text-[#212C36] dark:text-white'>
											Filters
										</h3>
										<div className='flex items-center gap-2'>
											<span
												className='cursor-pointer text-[11px] font-normal text-[#677380] dark:text-white'
												onClick={() => clearData()}
											>
												CLEAR ALL
											</span>
											<CloseIcon
												className='cursor-pointer dark:text-white'
												onClick={() => {
													setOpenModal(false);
													setIsHoverFilter(false), setIsOpenFilter(false);
												}}
											/>
										</div>
									</div>
									<div className='mt-4 pb-12 pl-9'>
										<ul>
											{filterKeys.map((elem) => {
												return (
													<li
														key={elem.displayName}
														className='mb-0 flex cursor-pointer items-center justify-between py-2 pr-5'
														onClick={() => {
															setOpenModal(true);
															setSelectedFilter(elem);
														}}
													>
														<div className='flex items-center gap-1'>
															<div
																className={`h-1 w-1 rounded ${
																	isSelected(
																		elem.caption,
																		filterData[elem.caption]
																	)
																		? "bg-red"
																		: "bg-transparent"
																} `}
															></div>
															{elem.displayName}
														</div>
														<Image
															src='/images/icon/rightIcon.svg'
															alt='rightIcon'
															height={15}
															width={8}
														/>
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}
					{openModal && showToolBar && (
						<div
							onMouseEnter={() => {
								setIsHoverFilter(true);
								if (openModal) {
									setOpenModal(true);
								}
							}}
							onMouseLeave={() => {
								if (!isHoverFilter) {
									setIsHoverFilter(false);
									setOpenModal(false);
								}
							}}
							style={{
								width: "400px",
								height: "calc(100vh - 115px)",
								background: "white",
								position: "absolute",
								left: "400px",
								top: "-50px",
								zIndex: 900,
								border: "1px solid #dfdfdf",
							}}
							className='px-5 dark:!bg-gray-dark dark:text-white'
						>
							<div className='flex items-center justify-between py-5 dark:bg-gray-dark dark:text-white'>
								<span className='font-[14px] font-bold text-[#212c36] dark:bg-gray-dark dark:text-white'>
									Filter By {selectedFilter?.displayName}
								</span>
								<Button
									height='40px'
									onClick={() => applyButtonClick()}
									className='!w-[130px]'
								>
									Apply
								</Button>
							</div>
							<div className='!h-6'>
								<DispayedComponent
									value={{
										data: filterData[selectedFilter.caption],
										handleChange:
											selectedFilter.caption === "creation"
												? handleChangeCalendar
												: selectedFilter.caption === "stages" ||
													  selectedFilter.caption === "states" ||
													  selectedFilter.caption === "List" ||
													  selectedFilter.caption === "Tag" ||
													  selectedFilter.caption === "Star" ||
													  selectedFilter.caption === "Rating"
													? handleChangeSelect
													: handleChange,
										componentName: selectedFilter.caption,
										displayName: selectedFilter.displayName,
										selectedValue: selectedValues(
											selectedFilter.caption,
											filterData[selectedFilter.caption]
										),
									}}
								/>
							</div>
						</div>
					)}
					<div
						style={{
							transition: "1s",
							width: isOpenFilter ? "400px" : "0",
							height: "calc(100vh - 200px)",
						}}
					></div>
					<DataGrid
						dataSource={dataSourceOptions}
						onExporting={onExporting}
						showBorders={false}
						showRowLines={true}
						showColumnLines={false}
						columnAutoWidth
						allowColumnReordering
						rowAlternationEnabled={false}
						renderAsync
						className={` ${theme === "dark" ? "data-grid-table-dark" : ""} ${
							isOpenFilter ? "table_body" : "table_body_filter"
						}`}
						onToolbarPreparing={(e) => {
							const toolbarItems = e.toolbarOptions.items;
							toolbarItems?.forEach(function (item) {
								if (item.name === "searchPanel") {
									item.location = "before";
								}
								if (item.name === "groupPanel") {
									item.location = "center";
								}
							});
						}}
					>
						<Selection mode='multiple' />
						<GroupPanel visible={showToolBar} />
						{/* {showToolBar && <ColumnChooser enabled={true} />} */}
						{showToolBar && (
							<SearchPanel visible={true} placeholder='Search leads' />
						)}
						<Grouping autoExpandAll={false} />
						<ColumnFixing enabled={true} />
						<Column
							key={"PhotoPublicId"}
							dataField={"PhotoPublicId"}
							caption={""}
							dataType={"string"}
							visible
							alignment='center'
							cellRender={PhotoTemplate}
							cssClass={compactView ? "image_size" : ""}
						/>
						{leadKeys.map(
							(item) =>
								item.key !== "PhotoPublicId" && (
									<Column
										key={item.key}
										dataField={item.key}
										caption={item.caption}
										dataType={item?.dataType ?? "string"}
										visible={item.visible}
										alignment='left'
									/>
								)
						)}
						<Pager
							allowedPageSizes={[10, 20, 50, 100]}
							showPageSizeSelector={true}
							visible
						/>
						<Paging defaultPageSize={20} />
						{showToolBar && (
							<Export
								enabled={true}
								allowExportSelectedData={true}
								formats={["pdf", "xlsx", "csv"]}
							/>
						)}
					</DataGrid>
				</div>
			</div>
		</div>
	);
};

export default ReferredLeadsPage;
