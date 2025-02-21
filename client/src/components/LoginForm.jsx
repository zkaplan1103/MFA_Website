import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register, loginUser, authRegister } from "../service/authApi";

const LoginForm = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isAuthRegister, setIsAuthRegister] = useState(false);
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser(username, password);
            setMessage(data.message);
            setUsername("");
            setPassword("");
            setError("");
            onLoginSuccess(data);
        } catch (error) {
            setUsername("");
            setPassword("");
            setMessage("");
            setError("Invalid login credentials");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register(username, password, email);
            setIsRegister(false);
            setMessage(data.message);
            setUsername("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            setError("");
        } catch (error) {
            setUsername("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            setMessage("");
            setError("Something went wrong during user registration");
        }
    };

    const handleAuthRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await authRegister(username, password, email);
            setIsAuthRegister(false);
            setMessage(data.message);
            setUsername("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            setError("");
        } catch (error) {
            setUsername("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            setMessage("");
            setError("Something went wrong during business account registration");
        }
    };

    const handleRegisterToggle = () => {
        setIsRegister(!isRegister);
        setIsAuthRegister(false);
        setError("");
        setMessage("");
    };

    const handleAuthRegisterToggle = () => {
        setIsAuthRegister(!isAuthRegister);
        setIsRegister(false);
        setError("");
        setMessage("");
    };

    return (
        <form onSubmit={isRegister ? handleRegister : isAuthRegister ? handleAuthRegister : handleLogin} className='bg-white rounded-lg shadow-md w-full max-w-sm mx-auto'>
            <div className='pt-6'>
                <h2 className='text-3xl text-center font-extralight'>{isRegister ? "Create Account" : isAuthRegister ? "Create Business Account" : "Login"}</h2>
            </div>
            <hr className='text-gray-200 mt-6 mb-6'/>
            <p className='text-center text-gray-600 text-lg font'>
              {isRegister || isAuthRegister ? "Looks like you are new here!" : "We're glad to see you again!"}
            </p>
            <div className='p-6'>
                <div className='mb-4'>
                    <label className='text-gray-600 text-sm'>Username</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full p-2 border rounded mt-2'
                        placeholder={isRegister || isAuthRegister ? 'Enter a Username' : 'Enter Your Username or Email'}
                        required
                    />
                </div>
                {isRegister || isAuthRegister ? (
                    <div className='mb-4'>
                        <label className='text-gray-600 text-sm'>Email</label>
                        <input 
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded mt-2' 
                            placeholder='Enter Email'
                            required
                        /> 
                    </div>
                ) : ("")}
                <div className='mb-4'>
                    <label className='text-gray-600 text-sm'>Password</label>
                    <input 
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded mt-2' 
                        placeholder={isRegister || isAuthRegister ? 'Enter a Password' : 'Enter Your Password'}
                        required
                    />
                </div>
                {isRegister || isAuthRegister ? (
                    <div className='mb-4'>
                        <label className='text-gray-600 text-sm'>Confirm Password</label>
                        <input 
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full p-2 border rounded mt-2' 
                            placeholder='Confirm Password'
                            required
                        /> 
                    </div>
                ) : ("")}
                {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
                {message && <p className='text-green-600 text-sm mb-3'>{message}</p>}
                <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded-md'>
                    {isRegister ? "Register" : isAuthRegister ? "Register Business Account" : "Login"}
                </button>
                <div>
                  <p className='pt-4 text-center text-gray-600 text-sm'>
                    {isRegister || isAuthRegister ? "Already have an account?" : "Don't have an account?"} {" "}
                    <Link to="" onClick={isAuthRegister ? handleAuthRegisterToggle : handleRegisterToggle}> 
                        {isRegister || isAuthRegister ? "Login" : "Create Account"}
                    </Link>
                  </p>
                    {!isAuthRegister && (
                        <p className='pt-2 text-center text-gray-600 text-sm'>
                            <Link to="" onClick={handleAuthRegisterToggle}>Create Business Account?</Link>
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
