"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useWithAuthorized = () => {
	const router = useRouter();
	const [hasAccess, setHasAccess] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		const isLoggedIn = localStorage.getItem("accessToken");

		if (!isLoggedIn) {
			router.replace("/auth/signin");
		} else {
			setHasAccess(true);
		}
	}, [router]);

	return hasAccess;
};

export default useWithAuthorized;
