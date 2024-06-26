import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SettingsIcon = () => {
	return (
		<Link href='' className='flex h-[26px] items-center justify-center'>
			<Image
				width={18}
				height={18}
				alt='Settings'
				src='/images/icon/editIcon.svg'
			/>
		</Link>
	);
};
