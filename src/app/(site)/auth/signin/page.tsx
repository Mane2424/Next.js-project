"use client";
import React from "react";
import Signin from "@/components/Auth/Signin";

const SigninPage = () => {
	return (
		<main className="flex h-[100vh] items-center justify-center bg-[url('/images/bg-login.svg')] bg-cover">
			<Signin />
		</main>
	);
};

export default SigninPage;
