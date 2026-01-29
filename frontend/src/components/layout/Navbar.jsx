import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { sweetAlert } from '../../utils/sweetAlert';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        const result = await sweetAlert.confirm(
            'Sign Out?',
            'Are you sure you want to sign out of your account?',
            'Yes, sign out',
            'Cancel'
        );

        if (result.isConfirmed) {
            try {
                await logout();
                sweetAlert.toast.success('Successfully signed out. See you soon!');
            } catch (error) {
                sweetAlert.toast.error('Error signing out. Please try again.');
            }
        }
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
                            ✨ MyBlog
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            <Link to="/" className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-white/50 transition-all">
                                Home
                            </Link>
                            {user && (
                                <>
                                    <Link to="/dashboard" className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-white/50 transition-all">
                                        Dashboard
                                    </Link>
                                    <Link to="/trash" className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-white/50 transition-all">
                                        Trash
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-slate-700 font-medium">Welcome, {user.name}</span>
                                </div>
                                <Button onClick={handleLogout} variant="ghost" size="sm">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;