"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/config/api-client";
import InputGroup from "../Dashboard/InputGroup";
import { Button } from "../Dashboard/Button";
import toast from "react-hot-toast";
interface IChangePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface IPasswordComplexitySetting {
	allowedMinimumLength: number;
	requireDigit: boolean;
	requireLowercase: boolean;
	requireNonAlphanumeric: boolean;
	requireUppercase: boolean;
	requiredLength: number;
}

export const ChangePassword = ({ onClose }: any) => {
	const [data, setData] = useState<IChangePasswordFormData>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [validationObject, setValidationObject] =
		useState<IPasswordComplexitySetting>({} as IPasswordComplexitySetting);

	const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>(
		[]
	);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
	const validateInput = (inputValue: string, inputName: string) => {
		const {
			allowedMinimumLength,
			requireDigit,
			requireLowercase,
			requireNonAlphanumeric,
			requireUppercase,
			requiredLength,
		} = validationObject;

		if (inputName === "newPassword") {
			const newErrors = [];

			if (inputValue.length === 0) {
				newErrors.push(`New password is required.`);
			}
			if (inputValue.length < requiredLength) {
				newErrors.push(`Password should be longer than ${requiredLength}.`);
			}

			if (allowedMinimumLength && inputValue.length < allowedMinimumLength) {
				newErrors.push(
					`Password should be  at least ${allowedMinimumLength} characters.`
				);
			}

			if (requireDigit && !/\d/.test(inputValue)) {
				newErrors.push("Password must contain a digit.");
			}

			if (requireLowercase && !/[a-z]/.test(inputValue)) {
				newErrors.push("Password must contain a lowercase letter.");
			}

			if (requireUppercase && !/[A-Z]/.test(inputValue)) {
				newErrors.push("Password must contain an uppercase letter.");
			}

			if (requireNonAlphanumeric && !/\W/.test(inputValue)) {
				newErrors.push("Password must contain a special character.");
			}
			setErrors(newErrors);
		}

		const confirmPasswordErrors = [];

		if (inputName === "newPassword") {
			if (inputValue !== data.confirmPassword) {
				confirmPasswordErrors.push("Password do not match!");
			}
		} else {
			if (inputValue !== data.newPassword) {
				confirmPasswordErrors.push("Password do not match!");
			}
		}

		setConfirmPasswordError(confirmPasswordErrors);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
		if (
			e.target.name === "newPassword" ||
			e.target.name === "confirmPassword"
		) {
			validateInput(e.target.value, e.target.name);
		}
	};

	const GetPasswordComplexitySetting = async () => {
		const response = await apiClient.get(
			"/api/services/Platform/Profile/GetPasswordComplexitySetting"
		);
		const result = response.data.result;
		setValidationObject(result.setting);
	};
	const changePassword = async () => {
		if (!errors.length && !confirmPasswordError.length) {
			setLoading(true);
			try {
				await apiClient.post("/api/services/Platform/Profile/ChangePassword", {
					newPassword: data.newPassword,
					currentPassword: data.currentPassword,
				});
				toast.success("Password changed successfully!");
				onClose();
				setLoading(false);
				setData({
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
				});
			} catch (error) {
				const errorMessage =
					(error as any).response.data.error.message ?? "Something went wrong";
				setPasswordErrorMessage(errorMessage);
				toast.error(errorMessage);
				setLoading(false);
			}
		}
	};
	useEffect(() => {
		GetPasswordComplexitySetting();
	}, []);

	return (
		<div>
			<InputGroup
				label='Current password'
				placeholder=''
				type='password'
				name='currentPassword'
				required
				height='50px'
				handleChange={handleChange}
				value={data.currentPassword}
			/>
			<div className='py-4 pl-12 text-[#f4516c]'>
				<span>
					{passwordErrorMessage}
					<br />
				</span>
			</div>
			<InputGroup
				label='New password'
				placeholder=''
				type='password'
				name='newPassword'
				required
				height='50px'
				handleChange={handleChange}
				value={data.newPassword}
			/>
			<div className='py-4 pl-12 text-[#f4516c]'>
				<ul className='list-disc'>
					{errors.map((error, index) => (
						<li key={index}>
							{error}
							<br />
						</li>
					))}
				</ul>
			</div>
			<InputGroup
				label='New password (repeat)'
				placeholder=''
				type='password'
				name='confirmPassword'
				required
				height='50px'
				handleChange={handleChange}
				value={data.confirmPassword}
			/>
			<div className='py-4 pl-12 text-[#f4516c]'>
				<ul className='list-disc'>
					{confirmPasswordError.map((error, index) => (
						<li key={index}>
							{error}
							<br />
						</li>
					))}
				</ul>
			</div>
			<div className='mt-6 w-[150px]'>
				<Button height='50px' onClick={changePassword} disabled={loading}>
					Save & Close
				</Button>
			</div>
		</div>
	);
};
