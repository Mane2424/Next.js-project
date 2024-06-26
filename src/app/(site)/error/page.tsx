"use client";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const ErrorPage = () => {
	const router = useRouter();
	useLayoutEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			router.replace("/app/dashboard");
		} else {
			router.replace("/auth/signin");
		}
	}, []);
	return <></>;
};

export default ErrorPage;
