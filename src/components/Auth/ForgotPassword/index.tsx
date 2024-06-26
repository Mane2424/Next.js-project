"use client";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import Loader from "@/components/Common/Loader";
import validateEmail from "@/libs/validateEmail";
import { authenticateByCode, sendResetLink } from "@/services/auth.service";
import CodeInput from "@acusti/react-code-input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Common/Dashboard/Button";

type TStep = "email" | "code" | "expired";
const formatTime = (time: number) => (time < 10 ? `0${time}` : time.toString());

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<TStep>("email");
	const [tenantId, setTenantId] = useState<number>(1);
	const [minutes, setMinutes] = useState(5);
	const [seconds, setSeconds] = useState(0);
	const [code, setCode] = useState("");
	const remainedTime = `${formatTime(minutes)}:${formatTime(seconds)}`;
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	const onChangeCode = async (value: string) => {
		setCode(value);
		if (value.length === 6) {
			try {
				await authenticateByCode(value, email, tenantId);
				router.replace("/app/dashboard");
			} catch (error) {
				const errorMessage =
					(error as any).response.data.error.message ?? "Something went wrong";
				toast.error(errorMessage, {
					duration: 5000,
					position: "top-right",
				});
				console.error("forgot password code submit error:", error);
			}
		}
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email address.");

			return;
		}
		if (!validateEmail(email)) {
			toast.error("Please enter a valid email address.");
			return;
		}
		setLoading(true);
		try {
			const res = await sendResetLink(email);
			setTenantId(res);
			setStep("code");
		} catch (error) {
			const errorMessage =
				(error as any).response.data.error.message ?? "Something went wrong";
			toast.error(errorMessage, {
				duration: 5000,
				position: "top-right",
			});
		}
		setLoading(false);
	};
	useEffect(() => {
		let timer: NodeJS.Timeout;

		const updateTimer = () => {
			if (minutes === 0 && seconds === 1) {
				setStep("expired");
				clearInterval(timer);
			} else {
				if (seconds === 0) {
					setMinutes(minutes - 1);
					setSeconds(59);
				} else {
					setSeconds(seconds - 1);
				}
			}
		};

		if (step === "code") {
			timer = setInterval(updateTimer, 1000);
		}

		return () => clearInterval(timer);
	}, [step, minutes, seconds]);
	return (
		<div>
			{step === "email" && (
				<div className='mx-auto w-full max-w-[500px] rounded-2xl bg-[white] px-6 py-10 pt-12 dark:bg-gray-dark '>
					<div className='mb-7.5 flex flex-col items-center justify-center text-center'>
						<div className="mb-5 h-[55px] w-[180px] bg-[url('/images/Logo.svg')] bg-cover dark:bg-[url('/images/Logo-dark.svg')]" />
						<h3 className='mb-4 font-satoshi text-heading-5 font-bold text-dark dark:text-white'>
							Forgot Password?
						</h3>
						<p className='text-base dark:text-gray-5 dark:text-white'>
							A password reset link will be sent to your email to reset your
							password. If you don&apos;t get an email within a few minutes,
							please re-try.
						</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className='mb-5 space-y-4.5'>
							<InputGroup
								placeholder='Email address *'
								type='email'
								name='email'
								height='50px'
								handleChange={handleChange}
								value={email}
							/>
							<div className='flex items-center justify-center gap-5'>
								<Button
									type='button'
									height='40px'
									className='!w-[120px] border bg-transparent !text-dark hover:!text-white dark:hover:!text-dark'
									onClick={() => {
										router.push("/auth/signin");
									}}
								>
									Back
								</Button>
								<FormButton height='38px' className='!w-[120px]'>
									{" "}
									{loading ? (
										<>
											Sending
											<Loader style='border-white dark:border-dark' />
										</>
									) : (
										"Submit"
									)}
								</FormButton>
							</div>
						</div>
					</form>
				</div>
			)}
			{(step === "code" || step === "expired") && (
				<div className='mx-auto w-full max-w-[500px] rounded-2xl bg-[white] px-6 py-10 pt-12 dark:bg-gray-dark'>
					<div className='mb-7.5 text-center'>
						<h3 className='mb-8 font-satoshi  text-heading-5 font-bold text-dark dark:text-white'>
							Login Verification
						</h3>
						<p className='max-w-[500px] p-5 text-base dark:text-gray-5 dark:text-white'>
							Please check your mailbox and enter the code below:
						</p>
						<CodeInput
							type='number'
							fields={6}
							value={code}
							inputStyle={{
								fontFamily: "monospace",
								margin: "5px",
								MozAppearance: "textfield",
								width: "45px",
								borderRadius: "3px",
								fontSize: "30px",
								height: "45px",
								paddingLeft: "15px",
								border: "1px solid #888d92",
							}}
							onChange={(value: string) => onChangeCode(value)}
							name='code'
							inputMode='numeric'
							className='dark:text-white'
						/>
					</div>
					{step === "code" && (
						<div className='mt-5 flex flex-col items-center justify-center'>
							<h3 className='text-2xl font-semibold dark:text-white'>
								Check Your Email for a code
							</h3>
							<div className='flex flex-col items-center justify-center p-5'>
								<p className='text-center dark:text-white'>
									The Auto login link and code were to sent to email address:
								</p>
								<p className='font-semibold'>
									{email ?? "zhaoping.dev@gmail.com"}
								</p>
								<p className='mt-2.5 dark:text-white'>
									{" "}
									The code will expire in <strong>{remainedTime}</strong>{" "}
									minutes.
								</p>
								<div className='mx-auto my-6 flex gap-6'>
									<Link
										href='https://mail.google.com/mail/u/0/'
										className='flex gap-2'
									>
										<Image
											src='/images/gmail-icon.svg'
											alt='gmail'
											height={20}
											width={20}
										/>
										Open Gmail
									</Link>
									<Link
										href='https://outlook.live.com/mail/0/inbox'
										className='flex gap-2'
									>
										<Image
											src='/images/outlook-icon.svg'
											alt='gmail'
											height={20}
											width={20}
										/>
										Open Outlook
									</Link>
								</div>
								<p className='dark:text-white'>
									Can&apos;t find your code? Check your spam folder!
								</p>
							</div>
						</div>
					)}
					{step === "expired" && (
						<div className='mt-6 flex h-[50px] w-full items-center justify-center gap-3 rounded bg-[#FED7D7] px-4 py-3'>
							<Image
								src='/images/warning.svg'
								alt='warning'
								width={20}
								height={20}
							/>
							<p className='text-dark'>
								This code has expired.{" "}
								<span className='cursor-pointer text-blue-400'>
									Request a new code!
								</span>
							</p>
						</div>
					)}
				</div>
			)}
			<div className='flex items-center justify-center'>
				<span className='my-2.5 p-2.5 text-[13px] text-black'>
					2024 ©
				</span>
			</div>
		</div>
	);
}
