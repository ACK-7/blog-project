import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({ 
    label = "Phone Number", 
    value, 
    onChange, 
    error, 
    required = false,
    disabled = false,
    className = ""
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <PhoneInput
                country={'ug'}
                value={value}
                onChange={onChange}
                disabled={disabled}
                inputProps={{
                    name: 'phone',
                    required: required,
                    autoFocus: false
                }}
                containerStyle={{
                    width: '100%'
                }}
                inputStyle={{
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    paddingLeft: '48px',
                    borderTop: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderLeft: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderRight: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderBottom: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                }}
                buttonStyle={{
                    borderTop: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderLeft: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderBottom: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                    borderRight: 'none',
                    borderRadius: '12px 0 0 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)'
                }}
                enableSearch={true}
                searchPlaceholder="Search countries..."
                specialLabel=""
                placeholder="Enter phone number"
            />
            
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomPhoneInput;