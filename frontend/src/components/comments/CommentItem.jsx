import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import CommentForm from './CommentForm';
import { sweetAlert } from '../../utils/sweetAlert';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuth();

    const isAuthor = user && user.id === comment.author.id;
    const canDelete = isAuthor; // Could also include post author later

    const handleEdit = async (content) => {
        try {
            await onUpdate(comment.id, content);
            setIsEditing(false);
            sweetAlert.toast.success('Comment updated successfully');
        } catch (error) {
            sweetAlert.toast.error('Failed to update comment');
        }
    };

    const handleDelete = async () => {
        const result = await sweetAlert.confirmDelete(
            'Delete Comment?',
            'Are you sure you want to delete this comment? This action cannot be undone.',
            'Yes, delete it',
            'Cancel'
        );

        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                await onDelete(comment.id);
                sweetAlert.toast.success('Comment deleted successfully');
            } catch (error) {
                sweetAlert.toast.error('Failed to delete comment');
                setIsDeleting(false);
            }
        }
    };

    if (isDeleting) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center text-slate-500">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting comment...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-800">
                            {comment.author.name}
                            {isAuthor && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    You
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-slate-500">
                            {comment.created_at_human}
                            {comment.is_edited && (
                                <span className="ml-2 text-slate-400">(edited)</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                {(isAuthor || canDelete) && (
                    <div className="flex gap-2">
                        {isAuthor && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-xs"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleDelete}
                                className="text-xs"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Comment Content */}
            {isEditing ? (
                <CommentForm
                    onSubmit={handleEdit}
                    initialContent={comment.content}
                    isEditing={true}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                </div>
            )}
        </div>
    );
};

export default CommentItem;