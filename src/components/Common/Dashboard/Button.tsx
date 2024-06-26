export const Button = ({
	type = "submit",
	height,
	children,
	onClick,
	disabled,
	className,
}: any) => {
	return (
		<button
			type={type}
			className={` ${className} flex w-full items-center justify-center gap-2 rounded-lg bg-dark px-2.5 py-3.5  text-base font-medium tracking-[-.2px] text-white duration-300 hover:bg-dark/90 dark:bg-white dark:text-dark dark:hover:bg-white/90`}
			style={{ height: height }}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};
