import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { sweetAlert } from '../utils/sweetAlert';

const EmailVerification = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [verificationCode, setVerificationCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [resending, setResending] = useState(false);

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setVerificationCode(value);
            setError(null); // Clear error when user starts typing
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (verificationCode.length !== 6) {
            setError('Please enter a 6-digit verification code.');
            return;
        }

        setVerifying(true);
        setError(null);

        try {
            const response = await api.post('/email/verify-code', {
                code: verificationCode
            });

            await refreshUser(); // Refresh user data to update email_verified status
            
            sweetAlert.success(
                'Email Verified!',
                'Your email has been successfully verified. You can now access all features.'
            ).then(() => {
                navigate('/dashboard');
            });
        } catch (error) {
            console.error('Email verification error:', error);
            setError(error.response?.data?.message || 'Invalid or expired verification code. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const resendVerificationCode = async () => {
        setResending(true);
        setError(null);

        try {
            await api.post('/email/verification-code');
            sweetAlert.success(
                'Verification Code Sent!',
                'A new verification code has been sent to your email.'
            );
            setVerificationCode(''); // Clear the input
        } catch (error) {
            console.error('Resend verification error:', error);
            if (error.response?.status === 429) {
                setError('Too many requests. Please wait before requesting another verification code.');
            } else {
                setError(error.response?.data?.message || 'Failed to send verification code. Please try again.');
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Your Email</h2>
                    <p className="text-slate-600">
                        We've sent a 6-digit verification code to <strong>{user?.email}</strong>. 
                        Please enter the code below to verify your account.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={handleCodeChange}
                            placeholder="000000"
                            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                            maxLength="6"
                            autoComplete="one-time-code"
                            autoFocus
                        />
                        <p className="mt-2 text-sm text-slate-500 text-center">
                            Enter the 6-digit code from your email
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={verifying || verificationCode.length !== 6}
                        className="w-full"
                        variant="primary"
                    >
                        {verifying ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </div>
                        ) : (
                            'Verify Email'
                        )}
                    </Button>
                </form>

                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-slate-500 mb-3">
                            Didn't receive the code? Check your spam folder or request a new one.
                        </p>
                        <Button
                            onClick={resendVerificationCode}
                            disabled={resending}
                            variant="secondary"
                            className="w-full"
                        >
                            {resending ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </div>
                            ) : (
                                'Send New Code'
                            )}
                        </Button>
                    </div>

                   
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        The verification code expires in 10 minutes for security.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default EmailVerification;