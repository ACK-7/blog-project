import { useState } from 'react';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const CommentForm = ({ onSubmit, loading = false, initialContent = '', isEditing = false, onCancel = null }) => {
    const [content, setContent] = useState(initialContent);
    const { user } = useAuth();
    const maxLength = 1000;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim().length < 3) return;
        
        onSubmit(content.trim());
        if (!isEditing) {
            setContent(''); // Clear form after submission (but not when editing)
        }
    };

    if (!user) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-slate-600 mb-4">Please log in to leave a comment.</p>
                <Button 
                    onClick={() => window.location.href = '/login'}
                    size="sm"
                >
                    Log In
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {isEditing ? 'Edit Comment' : 'Leave a Comment'}
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    maxLength={maxLength}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300 placeholder-slate-400 resize-none"
                    disabled={loading}
                />
                <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm ${content.length > maxLength * 0.9 ? 'text-red-500' : 'text-slate-500'}`}>
                        {content.length}/{maxLength} characters
                    </span>
                    {content.length < 3 && content.length > 0 && (
                        <span className="text-sm text-red-500">
                            Minimum 3 characters required
                        </span>
                    )}
                </div>
            </div>
            
            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={loading || content.trim().length < 3}
                    className="flex-1 sm:flex-none"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isEditing ? 'Updating...' : 'Posting...'}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            {isEditing ? 'Update Comment' : 'Post Comment'}
                        </div>
                    )}
                </Button>
                
                {isEditing && onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

export default CommentForm;