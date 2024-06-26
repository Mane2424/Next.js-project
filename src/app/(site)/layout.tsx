"use client";
import "../../styles/globals.css";
import "../../styles/satoshi.css";
import "react-quill/dist/quill.snow.css";
import { Providers } from "./providers";
import ToastContext from "../context/ToastContext";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";
import Loader from "@/components/Common/PreLoader";
import useWithAuthorized from "../hooks/useWithAuthorized";
import AuthLayout from "../authLayout";
import { Provider } from "react-redux";
import { store } from "@/redux";
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState<boolean>(true);
	useWithAuthorized();

	useEffect(() => {
		setTimeout(() => setLoading(false), 100);
	}, []);

	return (
		<>
			<Provider store={store}>
				{loading ? (
					<Loader />
				) : (
					<>
						<ToastContext />
						<Providers>
							<NextTopLoader
								color='#635BFF'
								crawlSpeed={300}
								showSpinner={false}
								shadow='none'
							/>
							<AuthLayout>{children}</AuthLayout>
						</Providers>
					</>
				)}
			</Provider>
		</>
	);
}
