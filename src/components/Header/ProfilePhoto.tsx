import React, { useState, useRef } from "react";
import { Button } from "../Common/Dashboard/Button";
import { useActions } from "@/app/hooks/useActions";
import apiClient from "@/config/api-client";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const ProfilePhoto = ({ onClose }: any) => {
	const { getUser } = useActions();
	const [imageUrl, setImageUrl] = useState<string>("");
	const [image, setImage] = useState<any>("");
	const [urlPart, setUrlPart] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const cropperRef = useRef<any>(null);

	const handleImageChange = (e: any) => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		reader.onloadend = () => {
			setImage(reader.result);
			if (cropperRef.current) {
				cropperRef.current.cropper.replace(reader.result);
			}
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const handleImageUrlChange = (e: any) => {
		setImageUrl(e.target.value);
	};

	const handleCrop = async () => {
		setLoading(true);
		if (cropperRef?.current?.cropper !== undefined) {
			const base64Data = cropperRef.current?.cropper
				.getCroppedCanvas()
				.toDataURL()
				.replace(/^data:image\/\w+;base64,/, "");

			await apiClient.put(
				"/api/services/Platform/Profile/UpdateProfilePicture",
				{ originalImage: base64Data, source: imageUrl === image ? image : "" }
			);
			getUser();
			onClose();
		}
		setLoading(false);
	};
	const clearCropper = () => {
		setImage(null);
	};
	return (
		<div className='container mx-auto !min-h-[400px] min-w-[600px] !px-0'>
			<div className='flex !min-h-[400px] flex-col justify-between rounded bg-white dark:bg-gray-dark'>
				<div>
					<div className='flex w-full justify-between'>
						<div>
							<h2 className='text-xl font-semibold text-black dark:text-white'>
								Change profile photo
							</h2>
						</div>
						<div className='mb-5 flex w-[270px] flex-col'>
							<div className='flex'>
								<div
									className={`w-[170px] cursor-pointer dark:text-white ${
										!urlPart && "text-[#0e172b]"
									}`}
									onClick={() => setUrlPart(false)}
								>
									<div className='w-full text-center text-sm'>
										FROM COMPUTER
									</div>
								</div>
								<div
									className={`w-[100px] cursor-pointer dark:text-white ${
										urlPart && "text-[#0e172b]"
									}`}
									onClick={() => setUrlPart(true)}
								>
									<div className='w-full text-center text-sm'>FROM URL</div>
								</div>
							</div>
							<div
								className={`h-0.5 w-[170px] bg-[#1c274c] transition-all dark:bg-white ${
									!urlPart ? "pl-0" : "ml-[170px] !w-[100px]"
								}`}
							/>
						</div>
					</div>
					{!urlPart ? (
						<div className='h-11'>
							<input
								type='file'
								accept='image/*'
								className='hidden'
								id='profile-photo-input'
								onChange={handleImageChange}
							/>
							<div className='flex items-center gap-2 bg-[#f3f7fa] px-3 py-4'>
								<span className='text-[#0e172b] dark:text-white'>
									Select photo to apply
								</span>
								<Button
									height='30px'
									className='!w-[100px]'
									onClick={() =>
										document.getElementById("profile-photo-input")?.click()
									}
								>
									Open
								</Button>
							</div>
						</div>
					) : (
						<div className='flex h-16 items-center gap-2 bg-[#f3f7fa] px-3 py-4'>
							<input
								type='text'
								placeholder='Enter the URL'
								value={imageUrl}
								onChange={handleImageUrlChange}
								className='h-7 w-full border-b-2 border-gray-400 !bg-transparent px-4 py-2 focus:border-[#1c274c] focus:outline-none dark:bg-[#161f36] dark:text-white'
							/>
							<Button
								height='30px'
								className='!w-[100px]'
								onClick={() => setImage(imageUrl)}
							>
								Load
							</Button>
						</div>
					)}
					<div className='!min-w-300px !min-h-300px mx-auto mt-4'>
						<Cropper
							ref={cropperRef}
							src={image}
							aspectRatio={1}
							zoomable={false}
							viewMode={1}
							guides={false}
							style={{
								height: "100%",
								width: "100%",
								maxHeight: "600px",
								maxWidth: "600px",
							}}
						/>
					</div>
				</div>
				<div className='mt-6 flex justify-between'>
					<div>
						<button
							className='mr-4 rounded-lg border border-solid bg-white px-4 py-2 text-black hover:bg-gray-200'
							onClick={() => clearCropper()}
						>
							Clear
						</button>
					</div>
					<div className='flex gap-2'>
						<button
							className='mr-4 rounded-lg border border-solid bg-white px-4 py-2 text-black hover:bg-gray-200'
							onClick={() => onClose()}
						>
							Cancel
						</button>
						<Button
							height='40px'
							onClick={handleCrop}
							className='!w-[100px]'
							disabled={loading || image === ""}
						>
							Save
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
