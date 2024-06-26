import React, { useEffect, useState } from "react";
import "@/styles/myCommission.scss";
import axios from "axios";
import {
	IAffiliatePayoutSettingInfo,
	PaymentSettingType,
} from "@/types/payoutSettings";
import { getPaymentProxy } from "@/services/blob.service";
import Image from "next/image";
import { useTheme } from "next-themes";
import CustomModal from "../../Modals/CustomModal";
import { PayoutMethodDialog } from "../PayoutMethodDialog/PayoutMethotDialog";

export const AmountsContainer = () => {
	const { theme } = useTheme();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [ledgerTotals, setLedgerTotals] = useState<any>(undefined);
	const [paymentSetting, setPaymentSetting] = useState<
		IAffiliatePayoutSettingInfo | undefined
	>(undefined);
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
	useEffect(() => {
		getLedgerTotals();
		getPaymentProxy(setPaymentSetting, undefined);
	}, []);
	return (
		<div className='amounts-container dark:bg-gray-dark'>
			<div className='funds-amounts'>
				<div>
					<h1 className='dark:!text-white'>{"You have funds available!"}</h1>
					<h3 className='dark:!text-white'>
						{"Great Job! You have funds available to withdraw"}
					</h3>
				</div>
				<div className='amounts'>
					<div className='posted dark:!bg-[#151f34] dark:!text-white'>
						<h3 className='mb-[7px] dark:!text-white'>
							{"Totals Amounts Posted"}
						</h3>
						<div className='earned dark:!bg-[#151f34]'>
							<h4 className='mb-[7px] flex dark:!text-white'>
								<Image
									src='/images/icon/earnings.svg'
									className={theme === "dark" ? "white-filter" : ""}
									width={12}
									height={10}
									alt='earnings'
								/>
								{"Earned"}
							</h4>
							<p className='mb-[7px] dark:!text-white'>
								${ledgerTotals?.earnedAmount}
							</p>
						</div>
						<div className='withdrawn dark:!bg-[#151f34]'>
							<h4 className='mb-[7px] flex dark:!text-white'>
								<Image
									src='/images/icon/profits.svg'
									className={theme === "dark" ? "white-filter" : ""}
									width={12}
									height={10}
									alt='profits'
								/>
								{"Withdrawn"}
							</h4>
							<p className='green mb-[7px] dark:!text-white'>
								${ledgerTotals?.withdrawnAmount}
							</p>
						</div>
					</div>
					<div className='pending dark:!bg-[#151f34]'>
						<h3 className='mb-[7px] dark:!text-white'>{"Pending Amounts"}</h3>
						<div className='earned'>
							<h4 className='mb-[7px] flex dark:!text-white'>
								<Image
									src='/images/icon/earnings.svg'
									className={theme === "dark" ? "white-filter" : ""}
									width={12}
									height={10}
									alt='earnings'
								/>{" "}
								{"Earned"}
							</h4>
							<p className='mb-[7px] dark:!text-white'>
								${ledgerTotals?.pendingEarningsAmount}
							</p>
						</div>
						<div className='withdrawn'>
							<h4 className='mb-[7px] flex dark:!text-white'>
								<Image
									src='/images/icon/profits.svg'
									className={theme === "dark" ? "white-filter" : ""}
									width={12}
									height={10}
									alt='profits'
								/>
								{"Withdrawn"}
							</h4>
							<p className='green mb-[7px] dark:!text-white'>
								${ledgerTotals?.pendingWithdrawalsAmount}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`funds-available dark:!border-[#151f34] ${
					!!ledgerTotals?.availableBalance && "active"
				}`}
			>
				<div className='available'>
					<Image
						src='/images/icon/lock.svg'
						className={theme === "dark" ? "white-filter" : ""}
						width={25}
						height={50}
						alt='lock'
					/>
					<h3 className='dark:!text-white'>{"Referral Available"}</h3>
					<p className='amount dark:!text-white'>
						${ledgerTotals?.availableBalance}
					</p>
				</div>
			</div>
			<div className='funds-withdraw'>
				<button
					className={`request-withdrawal ${
						!!ledgerTotals?.availableBalance && "active"
					}`}
					disabled={ledgerTotals?.availableBalance <= 0}
				>
					{"Referral RequestWithdrawal"}
				</button>
				{paymentSetting && (
					<div className='payment-method'>
						{paymentSetting?.type === PaymentSettingType.PayPal && (
							<div className='pay-pal'>
								<span>
									{"You're connected with"}
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
								<span>{"You have Bank Transfer account configured!"}</span>
							</div>
						)}
						<div className='update-payment'>
							<a onClick={() => setOpenModal(true)}>
								{"Update payout provider details"}
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill={theme === "dark" ? "#fff" : "#151f34"}
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
			{openModal && (
				<CustomModal
					title='Select Payment Method'
					onClose={() => setOpenModal(false)}
					content={<PayoutMethodDialog onClose={() => setOpenModal(false)} />}
				/>
			)}
		</div>
	);
};
