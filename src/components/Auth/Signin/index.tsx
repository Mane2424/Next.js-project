"use client";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (
		<div>
			<div className='mx-auto flex w-full max-w-[500px] flex-col items-center rounded-2xl bg-[white] px-6 pb-9 pt-12 dark:bg-gray-dark'>
				<div className="h-[55px] w-[180px] bg-[url('/images/Logo.svg')] bg-cover dark:bg-[url('/images/Logo-dark.svg')]" />
				<p className='py-5 dark:text-white'>
					Enter your credentials to access your account
				</p>
				<div className='flex w-full items-center justify-center'>
					<SigninWithPassword />
				</div>
			</div>
			<div className='flex items-center justify-center'>
				<span className='my-2.5 p-2.5 text-[13px] text-black'>
					2024 ©
				</span>
			</div>
		</div>
	);
}
