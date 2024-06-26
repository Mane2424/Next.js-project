"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/referralPageDashboard.scss";
import Image from "next/image";
import { SharingService } from "@/services/sharing.service";
import { useAppSelector } from "@/redux";
import { userAccount } from "@/redux/selectors";
import { dashboard } from "@/redux/selectors";
import { AppFeatures, ContactGroup } from "@/types/appEnums";
import { useActions } from "@/app/hooks/useActions";

import SelectBox from "devextreme-react/select-box";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import {
	IAffiliatePayoutSettingInfo,
	PaymentSettingType,
} from "@/types/payoutSettings";
import CustomModal from "../Modals/CustomModal";
import { PayoutMethodDialog } from "./PayoutMethodDialog/PayoutMethotDialog";
import toast from "react-hot-toast";
import { getPaymentProxy } from "@/services/blob.service";
import { useTheme } from "next-themes";

export const Dashboard = () => {
	const account = useAppSelector(userAccount.account);
	const [ratesInfo, setRatesInfo] = useState<any>({});
	const [selectedLink, setSelectedLink] = useState<string>("");
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [contactGroupId] = useState<string>(ContactGroup.Client);
	const [contactId] = useState<undefined>(undefined);
	const [orgUnitsIds] = useState<number[]>([]);
	const [suggestedCopy, setSuggestedCopy] = useState<string>("");
	const [ledgerTotals, setLedgerTotals] = useState<any>(undefined);
	const [isCRMEnabled] = useState(true);
	const [paymentSetting, setPaymentSetting] = useState<
		IAffiliatePayoutSettingInfo | undefined
	>(undefined);
	const [isCRMCustomersEnabled] = useState(true);
	const [linksDataSource, setLinksDataSource] = useState<any>([]);
	const [selectInitialLink, setSelectInitialLink] = useState<any>(null);
	const [isCRMPaymentsEnabled, setIsCRMPaymentsEnabled] = useState<boolean>(
		account?.data?.application?.features?.[AppFeatures.CRMPayments]?.value &&
			account?.data?.application?.features?.[AppFeatures.CRMCommissions]?.value
	);
	const { theme } = useTheme();
	const { getTotalStats } = useActions();
	const totalStats = useAppSelector(dashboard.totalStats);
	const axiosApi = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
		responseType: "blob",
		headers: {
			Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
			["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
		},
	});
	const getRatesInfo = async () => {
		const response = await axiosApi.get(
			"/api/services/CRM/UserCommission/GetRatesInfo"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				setRatesInfo(resultData.result);
			})
			.catch(() => {
				setRatesInfo({});
			});
	};
	const getLedgerTotals = async () => {
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
	const getLinks = async () => {
		if (isCRMEnabled) {
			const response = await axiosApi.get(
				"/api/services/CRM/AffiliateLink/GetAll"
			);
			response?.data
				.text()
				.then((res: any) => {
					const resultData = res === "" ? null : JSON.parse(res);
					if (resultData.result && resultData.result.length) {
						setLinksDataSource(
							resultData.result.map((link: any, index: number) => {
								if (!index) setSelectInitialLink(link);
								link["index"] = index + 1;
								return link;
							})
						);
					}
				})
				.catch(() => {
					setLinksDataSource([]);
				});
		} else {
			setLinksDataSource([]);
		}
	};
	const getAffiliateRate = (): number => {
		return (ratesInfo.affiliateRate || ratesInfo.defaultAffiliateRate) * 100;
	};

	const getAffiliateRateTier2 = (): number => {
		return (
			(ratesInfo.affiliateRateTier2 || ratesInfo.defaultAffiliateRateTier2) *
			100
		);
	};

	const handleSelectedLinkChange = (value: any) => {
		const link = value?.value?.url ? value?.value?.url : value.value;
		setSelectedLink(
			`${link}${
				account?.data?.user?.affiliateCode
					? (link?.includes("?") ? "&" : "?") +
						"ref=" +
						account.data.user.affiliateCode
					: ""
			}`
		);
	};
	const copyLink = () => {
		navigator.clipboard.writeText(selectedLink);
		toast.success("Saved To Clipboard");
	};
	const valueChanged = (data: TextBoxTypes.ValueChangedEvent) => {
		setSelectedLink(data.value);
	};
	useEffect(() => {
		getRatesInfo();
		getLinks();
		getPaymentProxy(setPaymentSetting, undefined);
		getLedgerTotals();
		getTotalStats({
			contactGroupId,
			startDate: "",
			endDate: "",
			sourceContactId: contactId,
			sourceOrganizationUnitIds: orgUnitsIds,
		});
	}, []);

	useEffect(() => {
		if (account) {
			setIsCRMPaymentsEnabled(
				account?.data?.application?.features?.[AppFeatures.CRMPayments]
					?.value &&
					account?.data?.application?.features?.[AppFeatures.CRMCommissions]
						?.value
			);
			setSuggestedCopy(
				account?.data?.user ? account?.data?.user?.affiliateCode : null
			);
		}
	}, [account]);
	useEffect(() => {
		if (selectInitialLink) {
			setSelectedLink(
				`${selectInitialLink.url}${
					account?.data?.user?.affiliateCode
						? (selectInitialLink.url.includes("?") ? "&" : "?") +
							"ref=" +
							account.data.user.affiliateCode
						: ""
				}`
			);
		}
	}, [selectInitialLink]);
	return (
		<>
			<div className='w-full'>
				<div className='referrall-link-wrapper dark:bg-gray-dark'>
					<div className='left'>
						{(ratesInfo?.affiliateRate || ratesInfo?.defaultAffiliateRate) && (
							<p className='dark:!text-white'>
								<b className='dark:!text-white'>
									Your reward for referring new customers:
								</b>
								&nbsp;
								{getAffiliateRate() && (
									<span className='dark:!text-white'>
										<b>Tier 1 - {getAffiliateRate()}%</b>
									</span>
								)}
								{getAffiliateRateTier2() && (
									<span className='dark:!text-white'>
										<b> and Tier 2 - {getAffiliateRateTier2()}%</b>
									</span>
								)}
								<b className='dark:!text-white'> recurring commission</b>
								&nbsp;for each referred customer
							</p>
						)}
					</div>
					<div className='center dark:!bg-gray-dark'>
						<h1 className='dark:!text-white'>
							Share this referral link to your friends and followers
						</h1>
						<h3 className='dark:!text-white'>
							{`Click the "links" button to view all available referral links. You can
					also create your own links with sub-ids`}
						</h3>
						<div className='link-text-area dark:!bg-gray-dark'>
							<SelectBox
								width='150px'
								height='43px'
								disabled={false}
								dataSource={linksDataSource}
								placeholder={`Links (${linksDataSource?.length})`}
								valueExpr='url'
								displayExpr='companyName'
								value={selectInitialLink}
								onValueChanged={handleSelectedLinkChange}
							></SelectBox>
							<TextBox
								className='url'
								width='65%'
								height='43px'
								valueChangeEvent='keyup'
								value={selectedLink}
								onValueChanged={valueChanged}
							/>
							<button onClick={() => copyLink()}>Copy</button>
						</div>
						<div className='mt-3 flex items-end justify-start'>
							<p className='dark:!text-white'>Share on social media:</p>
							<div className='social'>
								<ul className='icons'>
									<li
										onClick={() => SharingService.shareInFacebook(selectedLink)}
									>
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
												selectedLink,
												"",
												suggestedCopy
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
											SharingService.shareInTwitter(selectedLink, suggestedCopy)
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
											SharingService.shareInPinterest(
												selectedLink,
												"",
												"suggestedCopy"
											)
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
											SharingService.shareVieEmail(selectedLink, suggestedCopy)
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
						</div>
					</div>
					<div className='right dark:bg-gray-dark'>
						{isCRMPaymentsEnabled && (
							<div className='payment-method dark:bg-gray-dark '>
								<h3>Important</h3>
								{!paymentSetting ? (
									<div>
										<p className='dark:!text-white'>{`You don't have a payout method selected. Please select one now so we can pay you.`}</p>
										<button onClick={() => setOpenModal(true)}>
											{"Select payout method"}
										</button>
									</div>
								) : (
									<div>
										{paymentSetting?.type == PaymentSettingType.PayPal && (
											<div className='pay-pal'>
												<span className='dark:!text-white'>
													{`You're connected with`}
													<Image
														src='/images/icon/paypal-logo.png'
														width={40}
														alt='PayPal'
													/>
												</span>
												<p className='email'>{paymentSetting?.emailAddress}</p>
											</div>
										)}
										{(paymentSetting?.type == PaymentSettingType.BankTransfer ||
											paymentSetting?.type == PaymentSettingType.Stripe) && (
											<div className='bank-transfer'>
												<span className='dark:!text-white'>{`You have Bank Transfer account configured!`}</span>
											</div>
										)}
										<div className='update-payment'>
											<a
												onClick={() => setOpenModal(true)}
												className='dark:!text-white'
											>
												Update payout provider details
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill={theme === "dark" ? "#fff" : "#02008a"}
													width='14px'
													height='14px'
													viewBox='0 0 24 24'
												>
													<path d='M14.707,20.707a1,1,0,0,1-1.414-1.414L19.586,13H2a1,1,0,0,1,0-2H19.586L13.293,4.707a1,1,0,0,1,1.414-1.414l8,8a1,1,0,0,1,.216.325.986.986,0,0,1,0,.764,1,1,0,0,1-.216.325Z' />
												</svg>
											</a>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className='statistic dark:bg-gray-dark'>
					{isCRMCustomersEnabled && (
						<div className='dark:text-white'>
							<p>{totalStats?.data?.totalLeadCount || 0}</p>
							<span className='dark:text-white'>{"Leads"}</span>
						</div>
					)}
					{isCRMCustomersEnabled && (
						<div>
							<p>{totalStats?.data?.totalClientCount || 0}</p>
							<span className='dark:text-white'>Customers</span>
						</div>
					)}
					<div>
						<p>
							{`${account?.data?.application?.currencySign}${
								totalStats?.data?.totalOrderAmount || 0
							}`}
						</p>
						<span className='dark:text-white'>Revenue</span>
					</div>
					<div>
						<p>
							{`${account?.data?.application?.currencySign}${
								ledgerTotals?.earnedAmount || 0
							}`}
						</p>
						<span className='dark:text-white'>Earnings</span>
					</div>
					<div>
						<p>
							{`${account?.data?.application?.currencySign}${
								ledgerTotals?.pendingEarningsAmount || 0
							}`}
						</p>
						<span className='dark:text-white'>Pending</span>
					</div>
				</div>
			</div>
			{openModal && (
				<CustomModal
					title='Select Payment Method'
					onClose={() => setOpenModal(false)}
					content={<PayoutMethodDialog onClose={() => setOpenModal(false)} />}
					setCloseModal={setOpenModal}
				/>
			)}
		</>
	);
};
