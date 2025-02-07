import React, { useState } from 'react';

const TwoFAVerification = () => {
        const [code, setCode] = useState("");
        const [error, setError] = useState("");
    return (
        <form onSubmit={handleTokenVerification} 
        className='bg-white rounded-lg shadow-md w-full max-w-sm mx-auto'>
        <div className='pt-6'>
            <h2 className='text-3xl text-center font-extralight'>
                Validate 
            </h2>
        </div>
        <hr className='text-gray-200 mt-6 mb-6'/>
        <p className='text-center text-gray-600 text-lg font'>
            Please enter 6-digit code to verify 2FA authentication
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
                placeholder= "Enter Your Code"
                required
                />
            </div>
            {isRegister ? (
            
            <div className='mb-4'>
                <label className='text-gray-600 text-sm'>Email</label>
                <input 
                label='Email' 
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-2 border rounded mt-2' 
                placeholder='Enter a Email'
                required
            /> </div>
            ) : ("")
            }
            <div className='mb-4'>
                <label className='text-gray-600 text-sm'>Password</label>
                <input 
                label='Password' 
                type='password'
                value={pasword}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 border rounded mt-2' 
                placeholder= {isRegister ? 'Enter a Password' : 'Enter Your Password'}
                required
                />
            </div>
       
            {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

            <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded-md mb-3'>
                Verify Code
            </button>
            <button type="button" className='w-full bg-slate-600 text-white py-2 rounded-md'
            onClick={handleReset}
            >
                Reset 2FA
            </button>
        </div>
    </form>
    );
};

export default TwoFAVerification;