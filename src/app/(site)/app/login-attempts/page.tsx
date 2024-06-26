"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/config/api-client";
import { ILoginAttemptData } from "@/types/loginAttemptData";

const LoginAttempts = () => {
	const [data, setData] = useState<ILoginAttemptData[]>([]);

	useEffect(() => {
		async function getLoginAttempts() {
			const response = await apiClient.get(
				"/api/services/Platform/UserLogin/GetRecentUserLoginAttempts"
			);

			setData([...(response.data.result.items ?? [])]);
		}

		getLoginAttempts();
	}, []);

	return (
		<div className='w-f flex flex-col items-center justify-center'>
			<div
				className={`h-[200px] w-4/5 rounded-2xl border-4 p-6 ${
					data[0]?.result === "Success"
						? "border-[#34bfa3]"
						: "border-[#f4516c]"
				}`}
			>
				<p>IP address:{data[0]?.clientIpAddress}</p>
				<p>Browser:{data[0]?.browserInfo}</p>
				<p>Time:{data[0]?.creationTime}</p>
			</div>
		</div>
	);
};

export default LoginAttempts;
