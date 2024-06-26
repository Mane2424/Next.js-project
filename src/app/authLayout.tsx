"use client";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthLayoutProps = {
	children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
	const router = useRouter();
	const path = usePathname();
	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (
			accessToken &&
			(path.includes("auth") || path === "/" || path === "/app")
		) {
			router.push("/app/dashboard");
		}
	}, [router]);

	return <div>{children}</div>;
};

export default AuthLayout;
