import React from "react";
interface IconProps {
	color?: string;
	size?: string;
	className?: string;
	onClick?: () => void;
}
export const CloseIcon: React.FC<IconProps> = ({
	color = "#000",
	size = "20",
	className,
	onClick,
	...props
}) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 50 50'
			width={size}
			height={size}
			className={className}
			color={color}
			{...props}
			onClick={onClick}
			fill='none'
		>
			<path
				d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
				fill='currentColor'
			/>
		</svg>
	);
};
