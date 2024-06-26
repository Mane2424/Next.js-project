"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/config/api-client";
import { ILoginAttemptData } from "@/types/loginAttemptData";
import { useAppSelector } from "@/redux";
import { userAccount } from "@/redux/selectors";
import { getProfilePicture } from "@/utils/getProfilePicture";
import Image from "next/image";
import { formatTimestamp } from "@/utils/loginAttemptsTimeFormat";

export const LoginAttempts = () => {
	const [data, setData] = useState<ILoginAttemptData[]>([]);
	const account = useAppSelector(userAccount.account);
	const [profilePicture, setProfilePicture] = useState<any>(
		"/images/dashboard/profile-avatar.png"
	);

	useEffect(() => {
		async function getLoginAttempts() {
			const response = await apiClient.get(
				"/api/services/Platform/UserLogin/GetRecentUserLoginAttempts"
			);

			setData([...(response.data.result.items ?? [])]);
		}

		getLoginAttempts();
	}, []);
	useEffect(() => {
		if (account?.data?.user?.profilePictureId || account?.data?.tenant?.id) {
			setProfilePicture(
				getProfilePicture(
					account?.data?.user?.profilePictureId,
					account?.data?.tenant?.id
				)
			);
		}
	}, [account]);
	return (
		<div className='flex h-[calc(100vh-100px)] w-full flex-col gap-4 overflow-y-scroll pr-2'>
			{data &&
				data.map((elem, index) => {
					return (
						<div
							className='w-f relative flex items-start justify-start'
							key={index}
						>
							<div
								className={`flex h-[150px] w-[100px] items-center justify-center rounded-s-lg ${
									elem?.result === "Success" ? "bg-[#34bfa3]" : "bg-[#f4516c]"
								}`}
							>
								<Image
									src={profilePicture}
									alt='profile name'
									className='cursor-pointer overflow-hidden rounded-full'
									width={48}
									height={48}
								/>
							</div>
							<div
								className={`absolute left-[95px] top-[70px] h-3 w-3 rotate-45 ${
									elem?.result === "Success" ? "bg-[#34bfa3]" : "bg-[#f4516c]"
								}`}
							></div>
							<div
								className={`h-[150px] w-[calc(100%-100px)]  rounded-e-lg  border p-6 text-sm ${
									elem?.result === "Success"
										? "border-[#34bfa3] text-[#34bfa3]"
										: "border-[#f4516c] text-[#f4516c]"
								} login_attempts_flex`}
							>
								<div>
									<p>IP address:</p> <p>{elem?.clientIpAddress}</p>
								</div>
								<div>
									<p>Browser:</p> <p> {elem?.browserInfo}</p>
								</div>
								<div>
									<p>Time:</p> <p> {formatTimestamp(elem?.creationTime)}</p>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
};
