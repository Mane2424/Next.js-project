import React, { useEffect, useState } from "react";
import "@/styles/referralPageLinks.scss";
import DataGrid, { Paging, Column } from "devextreme-react/data-grid";
import Image from "next/image";
import { SharingService } from "@/services/sharing.service";
import CustomModal from "../Modals/CustomModal";
import { userAccount } from "@/redux/selectors";
import { useAppSelector } from "@/redux";
import axios from "axios";
import { AddNewLink } from "./AddNewLink/AddNewLink";
import { Button } from "../Dashboard/Button";
import { useTheme } from "next-themes";
interface IGeneratorLink {
	imageUrl: string;
	copyYourReferralLink?: string;
	url: string;
	category: string;
	companyName: string;
	phoneNumber: string;
	suggestedCopy: string;
}
export const MyLinks = () => {
	const account = useAppSelector(userAccount.account);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [accessCode, setAccessCode] = useState(null);
	const [dataSourceOptions, setDataSourceOptions] = useState<any>([]);
	const [dataSourceOptionsCopy, setDataSourceOptionsCopy] = useState<any>([]);
	const manageAllowed = false;
	const [pageSize] = useState(12);
	const { theme } = useTheme();

	const getDataSource = async () => {
		const axiosApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await axiosApi.get(
			"/api/services/CRM/AffiliateLink/GetAll"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData.result && resultData.result.length) {
					const links = resultData.result.map((link: any) => {
						link.copyYourReferralLink =
							link.url +
							(accessCode
								? (link.url.includes("?") ? "=" : "/") + accessCode
								: "");
						return link;
					});
					setDataSourceOptions(links);
					setDataSourceOptionsCopy(links);
				} else {
					setDataSourceOptions([]);
				}
			})
			.catch(() => {
				setDataSourceOptions([]);
			});
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			const terms = e.target.value.toLowerCase().split("");
			const searchData = dataSourceOptionsCopy.filter(
				(link: IGeneratorLink) => {
					return (
						(link.category &&
							terms.every((item) =>
								link.category.toLowerCase().includes(item)
							)) ||
						(link.companyName &&
							terms.every((item) =>
								link.companyName.toLowerCase().includes(item)
							)) ||
						(link.copyYourReferralLink &&
							terms.every(
								(item) =>
									link.copyYourReferralLink?.toLowerCase().includes(item)
							)) ||
						(link.suggestedCopy &&
							terms.every((item) =>
								link.suggestedCopy.toLowerCase().includes(item)
							))
					);
				}
			);
			setDataSourceOptions(searchData);
		} else {
			setDataSourceOptions(dataSourceOptionsCopy);
		}
	};

	const addEditNewLink = () => {
		setOpenModal(true);
	};
	const onCellClick = () => {
		if (manageAllowed) setOpenModal(true);
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

	const ImgTemplate = ({ value }: any) => (
		<div>
			<Image
				src={value || "/images/icon/link2.svg"}
				className='image'
				height={30}
				width={30}
				alt='img'
			/>
		</div>
	);

	const LinkTemplate = ({ value }: any) => {
		return (
			<div className='ref-link-template flex flex-col gap-1'>
				<div className='link-value'>{value}</div>
				<div className='share-link'>
					<p className='sm'>Share</p>
					<ul>
						<li onClick={() => SharingService.shareInFacebook(value)}>
							<Image
								src='/images/icon/social/Facebook.svg'
								alt='facebook'
								width={20}
								height={20}
							/>
						</li>
						<li
							onClick={() =>
								SharingService.shareInLinkedin(
									value,
									"",
									value?.row?.data?.suggestedCopy
								)
							}
						>
							<Image
								src='/images/icon/social/Linkedin.svg'
								alt='Linkedin'
								width={20}
								height={20}
							/>
						</li>
						<li
							onClick={() =>
								SharingService.shareInTwitter(
									value,
									value?.row?.data?.suggestedCopy
								)
							}
						>
							<Image
								src='/images/icon/social/Twitter.svg'
								alt='Twitter'
								width={20}
								height={20}
							/>
						</li>
						<li
							onClick={() =>
								SharingService.shareInPinterest(value, "", "suggestedCopy")
							}
						>
							<Image
								src='/images/icon/social/Pinterest.svg'
								alt='Pinterest'
								width={20}
								height={20}
							/>
						</li>
						<li
							onClick={() =>
								SharingService.shareVieEmail(
									value,
									value?.row?.data?.suggestedCopy
								)
							}
						>
							<Image
								src='/images/icon/social/Email.svg'
								alt='Email'
								width={20}
								height={20}
							/>
						</li>
					</ul>
				</div>
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

	const SuggestedTemplate = ({ value }: any) => {
		return (
			<div className='relative'>
				<div className='suggested-template'>
					<div>
						{window.innerWidth > 1440
							? value.length > 78
								? value.substring(0, 78) + "..."
								: value
							: value}
					</div>
					<Image
						src={"/images/icon/copy.svg"}
						height={20}
						width={20}
						alt='copy'
						onClick={() => copy(value)}
						className='save-to-clipboard'
					/>
				</div>
				<div className='suggested-tooltip'>
					<div>
						{window.innerWidth > 1440
							? value.length > 78
								? value.substring(0, 78) + "..."
								: value
							: value}
					</div>
				</div>
			</div>
		);
	};

	useEffect(() => {
		if (account) {
			setAccessCode(
				account?.data?.user ? account?.data?.user?.affiliateCode : null
			);
		}
	}, [account]);

	useEffect(() => {
		if (accessCode) {
			getDataSource();
		}
	}, [accessCode]);

	return (
		<div>
			<div className='top-bar dark:bg-gray-dark'>
				<div />
				<div className='search-icon  dark:bg-[#161f36]'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
						<path fill='none' d='M0 0h24v24H0z' />
					</svg>
					<input
						type='text'
						placeholder=''
						onChange={handleSearchChange}
						className='dark:bg-[#161f36] dark:text-white'
					/>
				</div>
				{manageAllowed ? (
					<Button
						height='35px'
						onClick={addEditNewLink}
						className='!w-[100px]'
						disabled={false}
					>
						Add Link
					</Button>
				) : (
					<div />
				)}
			</div>
			<div className='grid-data-table dark:!bg-gray-dark'>
				<div className='tab dark:!bg-gray-dark dark:text-white'>GetLinks</div>
				<DataGrid
					allowColumnResizing
					rowAlternationEnabled
					hoverStateEnabled
					renderAsync
					onCellClick={onCellClick}
					dataSource={dataSourceOptions}
					className={` ${theme === "dark" ? "datagrid-table-dark" : ""} `}
				>
					<Column
						dataField='imageUrl'
						cellRender={ImgTemplate}
						width={48}
						cssClass='image'
						caption=''
					/>
					<Column
						dataField='category'
						width='15%'
						minWidth={128}
						caption={"Products Or Services"}
						cellRender={TextTemplate}
						cssClass='category'
					/>
					<Column
						dataField='companyName'
						width='15%'
						minWidth={128}
						caption={"Link Description"}
						cellRender={TextTemplate}
						cssClass='company'
					/>

					<Column
						dataField='phoneNumber'
						width={140}
						alignment='center'
						cellRender={TextTemplate}
						cssClass='tabular phone'
					/>
					<Column
						dataField='copyYourReferralLink'
						cellRender={LinkTemplate}
						width='33%'
						minWidth={300}
						caption={"Copy Your ReferralLink"}
						cssClass='link'
					/>

					<Column
						dataField='suggestedCopy'
						width={345}
						cellRender={SuggestedTemplate}
						cssClass='suggested-copy'
					/>
					<Paging pageSize={pageSize} />
				</DataGrid>
			</div>
			{openModal && (
				<CustomModal
					title='Add New Link'
					onClose={() => setOpenModal(false)}
					content={<AddNewLink onClose={() => setOpenModal(false)} />}
				/>
			)}
		</div>
	);
};
