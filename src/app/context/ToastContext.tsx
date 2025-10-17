"use client";
import { Toaster } from "react-hot-toast";

const ToastContext = () => {
	return (
		<div className='z-[99999]'>
			<Toaster position='top-center' reverseOrder={false} containerStyle={{ zIndex: 99999999 }} />
		</div>
	);
};

export default ToastContext;
