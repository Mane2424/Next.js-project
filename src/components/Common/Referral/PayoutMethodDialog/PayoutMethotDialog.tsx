"use client";
import React, { useEffect, useState } from "react";
import { Select } from "../../Select/Select";
import {
	connectStripeAccount,
	getPaymentProxy,
	payoutCreateOrUpdate,
} from "@/services/blob.service";
import {
	IAffiliatePayoutSettingInfo,
	PaymentSettingType,
} from "@/types/payoutSettings";
import "@/styles/referralPageDashboard.scss";
import { Button } from "../../Dashboard/Button";
import Image from "next/image";
import toast from "react-hot-toast";

export const PayoutMethodDialog = ({ onClose }: any) => {
	const [setting, setSetting] = useState<IAffiliatePayoutSettingInfo>({
		isDefault: true,
	} as IAffiliatePayoutSettingInfo);
	const [settings, setSettings] = useState<IAffiliatePayoutSettingInfo[]>([]);
	const [accountNumberError, setAccountNumberError] = useState<boolean>(false);
	const [emailError, setEmailError] = useState<boolean>(false);
	const [paymentTypes] = useState<{ name: string; value: string }[]>([
		{
			name: "PayPal",
			value: "PayPal",
		},
		{
			name: "Stripe",
			value: "Stripe",
		},
		{
			name: "Bank Transfer",
			value: "BankTransfer",
		},
	]);

	const [type, setType] = useState<PaymentSettingType | undefined>(undefined);
	const [paymentSetting, setPaymentSetting] = useState<
		IAffiliatePayoutSettingInfo | undefined
	>(undefined);

	const changePaymentType = (e: any) => {
		setType(e.target.value);
		const changeSetting =
			settings && settings.find((item) => item.type === type);
		if (changeSetting) setTimeout(() => setSetting(changeSetting), 100);
		else {
			setSetting({
				isDefault: true,
				type: type,
			} as IAffiliatePayoutSettingInfo);
		}
	};

	const changeSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "emailAddress") {
			setAccountNumberError(false);
		}
		if (e.target.name === "accountNumber") {
			setEmailError(false);
		}
		setSetting({
			...setting,
			[e.target.name]: e.target.value,
		});
	};
	const cleaerBankTransferFields = () => {
		setSetting({
			...setting,
			paymentCurrency: undefined,
			accountName: undefined,
			bankCode: undefined,
			accountNumber: undefined,
			iban: undefined,
			nationalIDNumber: undefined,
			taxID: undefined,
			swift: undefined,
			bankName: undefined,
			bankAddress: undefined,
			bankAddress2: undefined,
			bankCity: undefined,
			bankState: undefined,
			bankZip: undefined,
			country: undefined,
			intermediarySwift: undefined,
			intermediaryBankName: undefined,
			intermediaryBankCountry: undefined,
			intermediaryBankCity: undefined,
			intermediaryAccountNumber: undefined,
		});
	};
	const stripeAccount = async () => {
		await connectStripeAccount();
	};
	const update = async () => {
		if (setting.type == PaymentSettingType.PayPal) {
			if (!setting.emailAddress) {
				toast.error("The field Email is required");
				setEmailError(true);
				cleaerBankTransferFields();
			}
		} else if (setting.type == PaymentSettingType.BankTransfer) {
			if (!setting.accountNumber) {
				toast.error("The field BankAccountNumber is required");
				setAccountNumberError(true);
			}
			setSetting({ ...setting, emailAddress: undefined });
		} else {
			setSetting({ ...setting, emailAddress: undefined });
			cleaerBankTransferFields();
		}
		setSetting({ ...setting, isDefault: true });
		const result: any = await payoutCreateOrUpdate(setting);
		if (result?.success) {
			toast.success("Payment method updated successfully!");
			onClose();
		}
	};

	useEffect(() => {
		getPaymentProxy(setPaymentSetting, setSettings);
	}, []);

	useEffect(() => {
		if (paymentSetting?.isDefault) {
			setType(paymentSetting?.type);
			setSetting(paymentSetting);
		}
		if (!paymentSetting?.type && paymentTypes.length) {
			setType(paymentTypes[0].value as PaymentSettingType);
			setSetting({
				...setting,
				type: paymentTypes[0].value as PaymentSettingType,
			});
		}
	}, [paymentSetting, paymentTypes]);

	return (
		<div>
			<div className='max-h-[70vh] w-[420px] overflow-y-auto'>
				<div className=''>
					<label className='mb-2 block font-satoshi text-base font-medium text-dark dark:text-white'>
						Payment Types
					</label>
					{paymentTypes.length ? (
						<Select
							options={paymentTypes}
							name='TimeZone'
							onChange={(e) => changePaymentType(e)}
							value={type}
						/>
					) : (
						<p>No Data</p>
					)}
				</div>
				{type == PaymentSettingType.PayPal && (
					<div className='my-6'>
						<input
							type='text'
							placeholder='Email'
							value={setting.emailAddress}
							name='emailAddress'
							onChange={changeSetting}
							className={`w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white ${
								emailError &&
								"border-[#f00] placeholder-[#f00] focus:border-[#f00]"
							}`}
						/>
					</div>
				)}
				{type == PaymentSettingType.Stripe && (
					<div>
						{!setting.stripeAccountID ? (
							<div className='my-6 ml-1'>
								<p>
									<span>Stripe Account Is Not Connected</span>
									<span style={{ color: "red", display: "inline" }}> *</span>
								</p>
								<a
									role='button'
									href='javascript:void(0);'
									className='stripe-button'
									onClick={() => stripeAccount()}
								>
									Connect With
									<Image
										src='/images/icon/stripe.svg'
										alt='stripe'
										width={60}
										height={25}
									/>
								</a>
							</div>
						) : (
							<div>
								<p>Stripe Account Is Connected</p>
							</div>
						)}
					</div>
				)}
				{type == PaymentSettingType.BankTransfer && (
					<div className='mt-4 flex flex-col gap-4'>
						<div>
							<input
								type='text'
								placeholder='Payment Currency'
								value={setting.paymentCurrency}
								name='paymentCurrency'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Account Name'
								value={setting.accountName}
								name='accountName'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank Code'
								value={setting.bankCode}
								name='bankCode'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Account Number*'
								value={setting.accountNumber}
								name='accountNumber'
								onChange={changeSetting}
								className={`w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] ${
									accountNumberError &&
									"border-[#f00] placeholder-[#f00] focus:border-[#f00]"
								} focus:outline-none dark:bg-[#161f36] dark:text-white`}
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='IBAN'
								value={setting.iban}
								name='iban'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='National ID Number'
								value={setting.nationalIDNumber}
								name='nationalIDNumber'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='TaxID'
								value={setting.taxID}
								name='taxID'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='SWIFT'
								value={setting.swift}
								name='swift'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank Name'
								value={setting.bankName}
								name='bankName'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank Address'
								value={setting.bankAddress}
								name='bankAddress'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank Address 2'
								value={setting.bankAddress2}
								name='bankAddress2'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank City'
								value={setting.bankCity}
								name='bankCity'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank State'
								value={setting.bankState}
								name='bankState'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Bank Zip'
								value={setting.bankZip}
								name='bankZip'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Country'
								value={setting.country}
								name='country'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Intermediary Swift'
								value={setting.intermediarySwift}
								name='intermediarySwift'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Intermediary Bank Name'
								value={setting.intermediaryBankName}
								name='intermediaryBankName'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Intermediary Bank Country'
								value={setting.intermediaryBankCountry}
								name='intermediaryBankCountry'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Intermediary Bank City'
								value={setting.intermediaryBankCity}
								name='intermediaryBankCity'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
						<div>
							<input
								type='text'
								placeholder='Intermediary Account Number'
								value={setting.intermediaryAccountNumber}
								name='intermediaryAccountNumber'
								onChange={changeSetting}
								className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
						</div>
					</div>
				)}
			</div>
			<div className='mt-2 flex gap-2 pt-2'>
				<button
					className='mr-4 rounded-lg border border-solid bg-white px-4 py-2 text-black hover:bg-gray-200'
					onClick={() => onClose()}
				>
					Cancel
				</button>
				<Button
					height='40px'
					onClick={() => update()}
					className='!w-[100px]'
					disabled={false}
				>
					Update
				</Button>
			</div>
		</div>
	);
};
