import "../styles/globals.css";
import "../styles/satoshi.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en' suppressHydrationWarning={true}>
			<head>
				<link
					href='https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700%7CMaterial+Icons%7CKameron%7CLato%7COpen+Sans:300,400,600%7CWork+Sans%7CPoppins:300,400,500,600,700'
					rel='stylesheet'
				/>
				<link rel='icon' href='/favicon.png' />
			</head>
			<body
				className={`${inter.className} flex min-h-screen flex-col dark:bg-[#151F34]`}
			>
				{children}
			</body>
		</html>
	);
};

export default layout;
