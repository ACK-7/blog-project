import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const EmailVerificationGuard = ({ children }) => {
    const { user, emailVerified, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!emailVerified) {
        return <Navigate to="/email/verify" />;
    }

    return children;
};

export default EmailVerificationGuard;