import React, { useState } from "react";
import { Button } from "../../Dashboard/Button";
import PhoneInput from "react-phone-number-input";

export const AddNewLink = ({ onClose }: any) => {
	const [setting, setSetting] = useState<any>({});
	const changeSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSetting({
			...setting,
			[e.target.name]: e.target.value,
		});
	};
	const handleChangePhoneNumber = (value: any) => {
		setSetting({ ...setting, phoneNumber: value });
	};
	const addLink = () => {
		//
	};
	return (
		<div className='mt-4 flex w-[370px] flex-col gap-4'>
			<div>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='370'
					height='130'
					viewBox='0 0 19 19'
				>
					<g
						fill='none'
						fillRule='evenodd'
						stroke='#686F76'
						strokeLinecap='square'
						strokeWidth='1.2'
					>
						<path d='M10.69 8.31a4.232 4.232 0 0 1 0 5.992l-2.38 2.423a4.232 4.232 0 0 1-5.993 0 4.232 4.232 0 0 1 0-5.993l2.125-2.04' />
						<path d='M8.31 10.69a4.232 4.232 0 0 1 0-5.992l2.38-2.423a4.284 4.284 0 0 1 6.035 0 4.232 4.232 0 0 1 0 5.992L14.6 10.35' />
					</g>
				</svg>
			</div>
			<div>
				<input
					type='text'
					placeholder='Enter Category'
					value={setting.category}
					name='category'
					onChange={changeSetting}
					className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
				/>
			</div>
			<div>
				<input
					type='text'
					placeholder='Enter Company Name'
					value={setting.companyName}
					name='companyName'
					onChange={changeSetting}
					className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
				/>
			</div>
			<div>
				<input
					type='text'
					placeholder='Enter Link*'
					value={setting.link}
					name='link'
					onChange={changeSetting}
					className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
				/>
			</div>
			<div className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'>
				<PhoneInput
					placheholder='phone'
					value={setting.phoneNumber}
					onChange={handleChangePhoneNumber}
					defaultCountry='US'
					international
				/>
			</div>
			<div>
				<input
					type='text'
					placeholder='Enter Suggested Copy'
					value={setting.suggestedCopy}
					name='suggestedCopy'
					onChange={changeSetting}
					className='w-full border-b-2 border-gray-400 px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
				/>
			</div>
			<div className='mt-2 flex gap-2 pt-2'>
				<button
					className='mr-4 rounded-lg border border-solid bg-white px-4 py-2 text-black hover:bg-gray-200'
					onClick={() => onClose()}
				>
					Cancel
				</button>
				<Button
					height='40px'
					onClick={() => addLink()}
					className='!w-[100px]'
					disabled={false}
				>
					Add Link
				</Button>
			</div>
		</div>
	);
};
