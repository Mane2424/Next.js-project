import React from "react";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Forgot Password - ${process.env.SITE_NAME}`,
	description: `This is Forgot Password page for ${process.env.SITE_NAME}`,
};

const ForgotPasswordPage = () => {
	return (
		<main className="flex h-[100vh] items-center justify-center bg-[url('/images/bg-login.svg')] bg-cover">
			<ForgotPassword />
		</main>
	);
};

export default ForgotPasswordPage;
