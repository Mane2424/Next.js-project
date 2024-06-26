"use client";
import React, { useEffect, useState } from "react";
import InputGroup from "../Common/Dashboard/InputGroup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import apiClient from "@/config/api-client";
import { Select } from "../Common/Select/Select";
import { Button } from "../Common/Dashboard/Button";
import "@/styles/invoices.scss";
import { useActions } from "@/app/hooks/useActions";
import Image from "next/image";
import axios from "axios";
import CustomModal from "../Common/Modals/CustomModal";
import { SmsVerification } from "./SmsVerification";

type ISettingsData = {
	emailAddress: string;
	name: string;
	surname: string;
	phoneNumber?: any;
	timezone: string;
	isPhoneNumberConfirmed: boolean;
	companyName?: string | null;
	countryId?: string | null;
	isGoogleAuthenticatorEnabled?: boolean;
	qrCodeSetupImageUrl?: string;
};
const axiosApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	responseType: "blob",
	headers: {
		Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
		["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
	},
});

export const MySettings = ({ onClose }: any) => {
	const { getUser } = useActions();
	const [profile, setProfile] = useState<boolean>(true);
	const [openModal, setOpenModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState<boolean>(false);
	const [user, setUser] = useState<ISettingsData>({
		emailAddress: "",
		name: "",
		surname: "",
		phoneNumber: "",
		timezone: "",
		isPhoneNumberConfirmed: false,
		companyName: "",
		countryId: "",
	});
	const [isGoogleAuthenticatorEnabled, setIsGoogleAuthenticatorEnabled] =
		useState<boolean>(false);
	const [data, setData] = useState<ISettingsData>({
		emailAddress: "",
		name: "",
		surname: "",
		phoneNumber: "",
		timezone: "",
		isPhoneNumberConfirmed: false,
		companyName: "",
		countryId: "",
	});
	const [timezones, setTimezones] = useState<{ name: string; value: string }[]>(
		[]
	);
	const handleChangePhoneNumber = (value: any) => {
		setData({ ...data, phoneNumber: value });
		setErrorMessage(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
		setErrorMessage(false);
	};

	const getData = async () => {
		const response = await apiClient.get(
			"/api/services/Platform/Profile/GetCurrentUserProfileForEdit"
		);
		const result = response.data.result;
		setData({
			companyName: result.companyName,
			countryId: result.countryId,
			emailAddress: result.emailAddress,
			isPhoneNumberConfirmed: result.isPhoneNumberConfirmed,
			name: result.name,
			surname: result.surname,
			phoneNumber: result.phoneNumber,
			timezone: result.timezone,
		});
		setUser(result);
		setIsGoogleAuthenticatorEnabled(!!result.isGoogleAuthenticatorEnabled);

		const timezoneRes = await apiClient.get(
			"/api/services/Platform/Timing/GetTimezones?DefaultTimezoneScope=4"
		);

		setTimezones([...timezoneRes.data.result.items]);
	};

	const consonChangeTimeZone = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setData({ ...data, timezone: e.target.value });
		setErrorMessage(false);
	};

	const saveData = async () => {
		if (data.name && data.surname && data.emailAddress) {
			try {
				await apiClient.put(
					"/api/services/Platform/Profile/UpdateCurrentUserProfile",
					data
				);
				getUser();
				onClose();
			} catch (error: any) {
				setErrorMessage(true);
			}
		}
	};

	const enableTFA = async () => {
		const response = await axiosApi.put(
			"/api/services/Platform/Profile/UpdateGoogleAuthenticatorKey"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (!resultData) {
					data.qrCodeSetupImageUrl = resultData.qrCodeSetupImageUrl;
					setIsGoogleAuthenticatorEnabled(true);
				}
			})
			.catch(() => setIsGoogleAuthenticatorEnabled(false));
	};
	const sendVerifyCode = async () => {
		const response = await axiosApi.post(
			"/api/services/Platform/Profile/SendVerificationSms"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData.success) {
					setOpenModal(true);
				}
			})
			.catch(() => setOpenModal(false));
	};
	useEffect(() => {
		getData();
	}, []);
	return (
		<div>
			<div className='flex items-end justify-end pb-1 pt-1'>
				<Button
					height='35px'
					className='!w-[120px]'
					onClick={() => saveData()}
					disabled={!data.name || !data.surname || !data.emailAddress}
				>
					Save & Close
				</Button>
			</div>
			<div className='mb-5 flex w-[270px] flex-col'>
				<div className='flex'>
					<div
						className={`w-[100px] cursor-pointer dark:text-white ${
							profile && "text-[#0e172b]"
						}`}
						onClick={() => setProfile(true)}
					>
						<div className='w-full pb-2 text-center text-sm'>Profile</div>
					</div>
					<div
						className={`w-[170px] cursor-pointer dark:text-white ${
							!profile && "text-[#0e172b]"
						}`}
						onClick={() => setProfile(false)}
					>
						<div className='w-full pb-2 text-center text-sm'>
							Two-factor Login
						</div>
					</div>
				</div>
				<div
					className={`h-0.5 w-[100px] bg-[#1c274c] transition-all dark:bg-white ${
						profile ? "pl-0" : "ml-[100px] !w-[170px]"
					}`}
				/>
			</div>
			{profile ? (
				<div className='flex flex-col gap-5'>
					<div className='flex w-full justify-between'>
						<div className=''>
							<InputGroup
								label='First Name'
								placeholder=''
								type='text'
								name='name'
								required
								height='50px'
								handleChange={handleChange}
								value={data.name}
							/>
							{!data.name && (
								<span className='pl-3 text-sm font-normal'>
									This field is required
								</span>
							)}
						</div>
						<div>
							<InputGroup
								label='Last Name'
								placeholder=''
								type='text'
								name='surname'
								required
								height='50px'
								handleChange={handleChange}
								value={data.surname}
							/>
							{!data.surname && (
								<span className='pl-3 text-sm font-normal'>
									This field is required
								</span>
							)}
						</div>
					</div>
					<div>
						<InputGroup
							label='Email Address'
							placeholder=''
							type='email'
							name='emailAddress'
							required
							height='50px'
							handleChange={handleChange}
							value={data.emailAddress}
						/>
						{!data.emailAddress && (
							<span className='pl-3 text-sm font-normal'>
								This field is required
							</span>
						)}
					</div>
					<div>
						<label className='mb-2.5 block font-satoshi text-base font-medium text-dark dark:text-white'>
							Phone
						</label>
						<div className='flex items-center gap-2'>
							<div className='w-full appearance-none rounded-md border border-stroke bg-gray-1 px-5 py-3 pl-4 pr-10 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-white/5 dark:text-white dark:focus:border-transparent'>
								<PhoneInput
									placheholder='phone'
									value={data.phoneNumber}
									onChange={handleChangePhoneNumber}
									defaultCountry='US'
									international
								/>
							</div>
							{!user.phoneNumber ? (
								<></>
							) : !user.isPhoneNumberConfirmed ? (
								<Button
									height='40px'
									className='!w-[100px]'
									onClick={() => sendVerifyCode()}
								>
									Verify
								</Button>
							) : (
								<span className='text-sm text-[#00BC55]'>Verified</span>
							)}
						</div>
					</div>
					<div>
						<label className='mb-2.5 block font-satoshi text-base font-medium text-dark dark:text-white'>
							Timezone
						</label>
						<Select
							options={timezones}
							name='TimeZone'
							onChange={consonChangeTimeZone}
							value={data.timezone}
						/>
					</div>
					<div>
						{errorMessage && (
							<span className='pl-3 text-sm font-normal text-[#f00] dark:text-white'>
								Your Request is not valid!
							</span>
						)}
					</div>
				</div>
			) : (
				<div>
					<h4 className='mb-[7px] text-[21px] text-[#000] dark:text-white'>
						Google Authenticator
					</h4>
					<div hidden={!isGoogleAuthenticatorEnabled}>
						<span>Scan QR Code with your mobile app</span>
						<div>
							<Image
								width={200}
								height={200}
								alt='QR'
								src={data.qrCodeSetupImageUrl || ""}
							/>
						</div>
						<small>
							Google Autenticator Refferer Link:
							<a
								href='https://support.google.com/accounts/answer/1066447?hl=en'
								target='_blank'
								rel='noreferrer'
							>
								Google Authenticator
							</a>
						</small>
					</div>
					<div hidden={isGoogleAuthenticatorEnabled}>
						<Button
							height='40px'
							className='!w-[100px]'
							onClick={() => enableTFA()}
						>
							Enable
						</Button>
					</div>
				</div>
			)}
			{openModal && (
				<CustomModal
					title='Verify Your Code'
					onClose={() => setOpenModal(false)}
					content={<SmsVerification onClose={() => setOpenModal(false)} />}
				/>
			)}
		</div>
	);
};
