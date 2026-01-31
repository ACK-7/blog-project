import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PhoneInput from '../components/common/PhoneInput';
import { sweetAlert } from '../utils/sweetAlert';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhoneChange = (phone) => {
        setFormData({
            ...formData,
            phone: phone
        });
    };

    const formatPhoneForAPI = (phone) => {
        // Handle empty or null phone
        if (!phone || phone.trim() === '') {
            return '';
        }
        
        // Remove any spaces or formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        // If phone doesn't start with +, add it
        if (!cleanPhone.startsWith('+')) {
            return '+' + cleanPhone;
        }
        
        return cleanPhone;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        // Debug: Log the form data being sent
        console.log('Registration form data:', formData);
        console.log('Phone before formatting:', formData.phone);
        
        const formattedPhone = formatPhoneForAPI(formData.phone);
        console.log('Phone after formatting:', formattedPhone);

        try {
            await register(
                formData.name,
                formData.email,
                formattedPhone, 
                formData.password,
                formData.password_confirmation
            );
            
            // Show success alert
            sweetAlert.success(
                'Account Created Successfully!',
                'Welcome to MyBlog! You can now start creating posts.'
            ).then(() => {
                navigate('/dashboard');
            });
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                sweetAlert.toast.error('Please fix the validation errors below');
            } else {
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                setErrors({ general: errorMessage });
                sweetAlert.error('Registration Failed', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold gradient-text mb-2">Join MyBlog</h2>
                    <p className="text-slate-600">Create your account and start writing</p>
                </div>

                <Card hover={false} className="p-8">
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name?.[0]}
                            placeholder="Enter your full name"
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email?.[0]}
                            placeholder="Enter your email"
                            required
                        />

                        <PhoneInput
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            error={errors.phone?.[0]}
                            required
                            disabled={loading}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password?.[0]}
                            placeholder="Create a password"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />

                        <Button 
                            type="submit" 
                            className="w-full mb-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : 'Create Account'}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;