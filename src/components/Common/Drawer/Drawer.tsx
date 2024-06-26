"use client";
import React, { ReactNode, useEffect } from "react";
import "../../../styles/drawer.css";
import { CloseIcon } from "../CloseIcon";
interface IDrawer {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	width?: number | string;
	title: string;
}
export const Drawer = ({
	isOpen,
	onClose,
	children,
	width,
	title,
}: IDrawer) => {
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "auto";
	}, [isOpen]);
	return (
		<div
			className={`${
				isOpen ? "z-[9999] opacity-100" : "hidden opacity-0"
			} animation fixed inset-0 overflow-hidden`}
		>
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0 transition-opacity' aria-hidden='true'>
					<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
				</div>
				<section
					className={`${
						isOpen ? "drawer_menu_opened" : "drawer_menu_closed"
					} drawer_menu flex h-full`}
					style={width ? { width } : { width: "400px" }}
				>
					<div className='relative w-screen dark:!bg-gray-dark'>
						<div className='flex h-full flex-col bg-white shadow-xl dark:!bg-gray-dark'>
							<div className='flex flex-col gap-1'>
								<div className='flex items-center justify-between px-4 pt-6 sm:px-6'>
									<h3 className='font-mono mb-4 text-2xl font-bold text-dark dark:text-white md:mb-0'>
										{title}
									</h3>
									<button
										onClick={onClose}
										className='float-right hover:text-gray-500'
									>
										<CloseIcon className='dark:text-white' />
									</button>
								</div>
								<div className='my-4 h-0.5 w-full bg-gray dark:bg-[#161f36]'></div>
								<div className='px-4 sm:px-6'>{children}</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};
