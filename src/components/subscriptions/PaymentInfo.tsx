import React, { useEffect, useState } from "react";
import "@/styles/subscription.scss";
import { Tooltip } from "devextreme-react/tooltip"; // Assuming you use DevExtreme for tooltips
import { getPaymentMethods, getPayments } from "@/services/blob.service";
import Image from "next/image";

export const PaymentInfo = ({ viewAllTransactions }: any) => {
	const [selectedPayment, setSelectedPayment] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState<any>([]);
	const [payments, setPayments] = useState<any>(null);
	const highlightPaymentInfo = (payment: any) => {
		setSelectedPayment(payment);
	};
	const currencyFormat = (num: any) => {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};
	const formatDate = (dateString: string) => {
		const options: any = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};
	useEffect(() => {
		getPayments(setPayments);
		getPaymentMethods(setPaymentMethod);
	}, []);
	return (
		<div className='paymeny-info'>
			<div className='summary-payment'>
				<div className='totalPaymentAmount'>
					<h4 className='dark:!text-white'>Total Amount</h4>
					<span className='dark:text-white'>
						{currencyFormat(payments?.totalPaymentAmounts?.USD ?? 0)}
					</span>
				</div>
			</div>
			<div className='details-payment'>
				<div className='transactions'>
					<h3 className='dark:!text-white'>Transactions</h3>
					<div className='dx-scroll-view' style={{ height: "400px" }}>
						{payments?.payments && payments?.payments?.length > 0 ? (
							<table className='container'>
								<tr className='row-payment head dark:!text-white'>
									<th className='col-3 date text-left'>{"Date"}</th>
									<th className='col-4 text-left'>{"Invoice"}</th>
									<th className='col-2 text-left'>{"Status"}</th>
									<th className='col-3 amount text-right dark:!text-white'>
										{"Amount"}
									</th>
								</tr>
								{payments?.payments?.map((payment: any, index: number) => (
									<tr
										key={index}
										className={`row-payment dark:!text-white ${
											selectedPayment === payment ? "active" : ""
										}`}
										onClick={() => highlightPaymentInfo(payment)}
									>
										<td className='col-3 date '>{formatDate(payment.date)}</td>
										<td className='col-4'>{payment.invoiceNumber}</td>
										<td className='col-2 status-data-column'>
											<div className='status-wrapper-payment h-[45px] dark:!text-white'>
												<div
													id={`payment${index}`}
													className={`status status-${
														payment.success ? "success" : "failed"
													} ${payment.statusString.toLowerCase()}`}
												>
													{payment.statusString}{" "}
													{!payment.success && payment.messages && (
														<>
															<i className='fa fa-info-circle'></i>
															<Tooltip
																position='bottom'
																target={`#payment${index}`}
																showEvent='hover'
																hideEvent='mouseleave'
															>
																{payment.messages}
															</Tooltip>
														</>
													)}
												</div>
											</div>
										</td>
										<td className='col-3 amount text-right dark:!text-white'>
											{currencyFormat(payment?.amount)}
										</td>
									</tr>
								))}
							</table>
						) : (
							<div>
								<div className='flex flex-col items-center justify-center'>
									<Image
										src='/images/no-data-icon.png'
										width={141}
										height={141}
										alt='NoData'
									/>
									<h3 className='mt-6 text-[24px] font-semibold text-[#202b35] dark:text-white'>
										No available data
									</h3>
								</div>
							</div>
						)}
						{payments?.payments?.length < payments?.length && (
							<button
								className='viewAllTransactions'
								onClick={viewAllTransactions}
							>
								{"View All Transactions"}
							</button>
						)}
					</div>
				</div>
				<div className='paymentMethods h-full w-full'>
					<div className='title'>
						<h3 className='dark:!text-white'>{"Payment Methods"}</h3>
						{false && (
							<button className='addNewPaymentMethod'>+{"AddNew"}</button>
						)}
					</div>
					{paymentMethod && !paymentMethod.lenght && (
						<div>
							<div className='flex flex-col items-center justify-center'>
								<Image
									src='/images/no-data-icon.png'
									width={141}
									height={141}
									alt='NoData'
								/>
								<h3 className='mt-6 text-[24px] font-semibold text-[#202b35] dark:text-white'>
									No available data
								</h3>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
