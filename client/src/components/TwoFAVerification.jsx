import React, { useState } from 'react';
import { setup2FA, verify2FA, reset2FA } from "../service/authApi";

const TwoFAVerification = ({ onVerifySuccess, onResetSuccess }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [canSendEmail, setCanSendEmail] = useState(true);

    const senEmail = async () => {
        try {
            const { data } = await setup2FA();
            alert("2FA setup email sent! Please check your inbox.");
            setCanSendEmail(false);  // Disable the button after email is sent
        } catch (error) {
            console.error("Error sending 2FA email:", error);
            setError("Unable to send 2FA setup email. Try again later.");
        }
    };

    const handleTokenVerification = async (e) => {
        e.preventDefault();
        try {
            const { data } = await verify2FA(code);
            onVerifySuccess(data);
        } catch (error) {
            setCode("");
            console.log("The err is: ", error.message);
            setError("Invalid Code");
        }
    };

    const handleReset = async () => {
        try {
            const { data } = await reset2FA();
            onResetSuccess(data);
            setCanSendEmail(true);  // Enable the "Send Email" button after reset
        } catch (error) {
            console.log("The err is: ", error.message);
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleTokenVerification} className='bg-white rounded-lg shadow-md w-full max-w-sm mx-auto'>
            <div className='pt-6'>
                <h2 className='text-3xl text-center font-extralight'>Validate</h2>
            </div>
            <hr className='text-gray-200 mt-6 mb-6' />
            <p className='text-center text-gray-600 text-lg font'>
                Please enter the 6-digit code sent to your email to verify 2FA authentication
            </p>
            <div className='p-6'>
                <div className='mb-4'>
                    <label className='text-gray-600 text-sm'>Code</label>
                    <input
                        label='Code'
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className='w-full p-2 border rounded mt-2'
                        placeholder="Enter Your Code"
                        required
                    />
                </div>
                {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

                <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded-md mb-3'>
                    Verify Code
                </button>
                <button
                    type="button"
                    className={`w-full py-2 rounded-md mt-3 ${canSendEmail ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                    onClick={senEmail}
                    disabled={!canSendEmail}
                >
                    Send 2FA Setup Email
                </button>
                <button
                    type="button"
                    className='w-full bg-slate-600 text-white py-2 rounded-md mt-3'
                    onClick={handleReset}
                >
                    Reset 2FA
                </button>
            </div>
        </form>
    );
};

export default TwoFAVerification;
