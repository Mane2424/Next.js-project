import React, { FC, ReactNode, useRef } from "react";
import { CloseIcon } from "../CloseIcon";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
interface ModalProps {
	title: string;
	content: ReactNode;
	onClose: () => void;
	zIndex?: number;
	className?: string;
	hasCloseIcon?: boolean;
	setCloseModal?: any;
}

const CustomModal: FC<ModalProps> = ({
	title,
	content,
	onClose,
	zIndex = 999,
	className = "",
	hasCloseIcon = true,
	setCloseModal,
}) => {
	const settingsRef = useRef<HTMLDivElement>(null);
	const onOutsideClickSettingsCallback = () => {
		setCloseModal && setCloseModal(false);
	};
	useOnClickOutside(settingsRef, onOutsideClickSettingsCallback);
	return (
		<div
			className={`fixed left-0 top-0 z-[${zIndex}] flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-6 `}
		>
			<div
				className={`${className} rounded-lg bg-white p-6 dark:bg-gray-dark`}
				ref={settingsRef}
			>
				<div className='mb-4 flex justify-between'>
					<h2 className='text-xl font-semibold text-black dark:text-white'>
						{title}
					</h2>
					{hasCloseIcon && (
						<CloseIcon
							className='cursor-pointer dark:text-white'
							onClick={onClose}
						/>
					)}
				</div>
				<div>{content}</div>
			</div>
		</div>
	);
};

export default CustomModal;
