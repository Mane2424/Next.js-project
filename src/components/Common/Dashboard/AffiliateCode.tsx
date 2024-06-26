import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/redux";
import { useActions } from "@/app/hooks/useActions";
import { userAccount } from "@/redux/selectors";
import toast from "react-hot-toast";

export const AffiliateCode = () => {
	const { updateAffiliateCode } = useActions();
	const account = useAppSelector(userAccount.account);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	const changeCode = (e: any) => {
		setInputValue(e.target.value);
	};
	const changeValue = () => {
		if (account?.data?.user?.affiliateCode !== inputValue) {
			updateAffiliateCode({ affiliateCode: inputValue });
		}
		setShowInput(false);
	};
	const cancleChange = () => {
		setInputValue(account?.data?.user?.affiliateCode);
		setShowInput(false);
	};

	const copyValue = () => {
		navigator.clipboard.writeText(inputValue);
		toast.success("Saved To Clipboard");
	};
	useEffect(() => {
		if (account?.data?.user?.affiliateCode) {
			setInputValue(account?.data?.user?.affiliateCode);
		}
	}, [account?.data?.user?.affiliateCode]);
	return (
		<div className='mb-7 flex min-h-10 w-full items-center justify-center rounded-md border border-dashed border-[#bab4a8]'>
			<div className='flex items-center justify-center'>
				<div
					className={` flex items-center justify-center ${
						showInput && "flex-col"
					} `}
				>
					<span className='text-[14px] text-[#0A0850] dark:text-white'>
						Affiliate info:
					</span>
					{!showInput ? (
						<div
							className={`${
								showEdit ? "cursor-pointer" : ""
							} flex items-center gap-2`}
							onMouseEnter={() => setShowEdit(true)}
							onMouseLeave={() => {
								setShowEdit(false);
							}}
						>
							<span className='pl-1 text-[14px] font-bold text-[#2838B2]'>
								{inputValue}
							</span>
							<div className='flex h-12 min-w-[60px] items-center justify-center'>
								{showEdit && !showInput && (
									<div className='flex h-4 items-center justify-center gap-1'>
										<Image
											src='/images/icon/affiliateEdit.svg'
											alt='icon'
											width={10}
											height={12}
											onClick={() => {
												setShowInput(true);
											}}
										/>
										<Image
											src='/images/icon/affiliateClose.svg'
											alt='icon'
											width={10}
											height={12}
										/>
										<Image
											src='/images/icon/affiliateCopy.svg'
											alt='icon'
											width={25}
											height={16}
											onClick={() => {
												copyValue();
											}}
										/>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className='mb-1 flex items-center justify-center gap-1 px-2'>
							<div className='h-[34px] w-3/5'>
								<input
									type='text'
									value={inputValue}
									onChange={(e) => changeCode(e)}
									className={`w-full rounded-lg border border-gray-3 px-3 py-2 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-primary/20 dark:border-stroke-dark dark:bg-transparent dark:text-white dark:focus:border-transparent`}
									style={{ height: "34px" }}
								/>
							</div>
							<button
								className=' flex h-[34px] w-8 items-center justify-center rounded bg-primary bg-opacity-10'
								onClick={() => changeValue()}
							>
								<Image
									src='/images/icon/affiliateDone.svg'
									alt='icon'
									width={20}
									height={18}
								/>
							</button>
							<button
								className='flex h-[34px] w-8 items-center justify-center rounded bg-primary bg-opacity-10'
								onClick={() => cancleChange()}
							>
								<Image
									src='/images/icon/affiliateRefresh.svg'
									alt='icon'
									width={18}
									height={18}
								/>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
