"use client";
import React, { useState } from "react";
import InputGroup from "../Common/Dashboard/InputGroup";
import { Button } from "../Common/Dashboard/Button";
import axios from "axios";

export const SmsVerification = ({ onClose }: any) => {
	const [smsCode, setSmsCode] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<boolean>(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSmsCode(e.target.value);
		setErrorMessage(false);
	};
	const sendVerifyCode = async () => {
		const apiClient = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		try {
			const response = await apiClient.post(
				"/api/services/Platform/Profile/VerifySmsCode",
				{ code: smsCode }
			);
			response?.data
				.text()
				.then((res: any) => {
					const resultData = res === "" ? null : JSON.parse(res);
					if (resultData.success) {
						onClose();
					}
				})
				.catch(() => {
					//
				});
		} catch (error: any) {
			if (error.response.status === 400) {
				setErrorMessage(true);
			}
		}
	};
	return (
		<div className='flex h-[230px] w-[300px] flex-col items-center justify-center gap-7'>
			<div className='mt-6'>
				<InputGroup
					label='Your Code'
					placeholder=''
					type='number'
					name='smsCode'
					required
					height='50px'
					handleChange={handleChange}
					value={smsCode}
					maxLength={6}
				/>
				{smsCode.length < 6 && (
					<span className='pl-3 text-sm font-normal dark:text-white'>
						Please enter at least 6 characters
					</span>
				)}
			</div>
			<div className='flex items-center justify-center'>
				<Button
					height='40px'
					className='!w-[100px]'
					onClick={() => sendVerifyCode()}
					disabled={smsCode.length < 6}
				>
					Verify
				</Button>
			</div>
			<div>
				{errorMessage && (
					<span className='pl-3 text-sm font-normal dark:text-white'>
						Wrong verification code!
					</span>
				)}
			</div>
		</div>
	);
};
