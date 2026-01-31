import { useState, useEffect } from 'react';
import api from '../../api/axios';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import { sweetAlert } from '../../utils/sweetAlert';

const CommentList = ({ postSlug }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchComments(currentPage);
    }, [postSlug, currentPage]);

    const fetchComments = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/posts/${postSlug}/comments?page=${page}&per_page=10`);
            setComments(response.data.data);
            setPagination(response.data.meta);
        } catch (error) {
            console.error('Error fetching comments:', error);
            sweetAlert.toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (content) => {
        setSubmitting(true);
        try {
            const response = await api.post(`/posts/${postSlug}/comments`, { content });
            
            // Add new comment to the beginning of the list
            setComments(prevComments => [response.data.data, ...prevComments]);
            
            // Update pagination count
            if (pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: prev.total + 1
                }));
            }
            
            sweetAlert.toast.success('Comment posted successfully');
        } catch (error) {
            console.error('Error posting comment:', error);
            if (error.response?.data?.errors?.content) {
                sweetAlert.toast.error(error.response.data.errors.content[0]);
            } else {
                sweetAlert.toast.error('Failed to post comment');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId, content) => {
        try {
            const response = await api.put(`/comments/${commentId}`, { content });
            
            // Update the comment in the list
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? response.data.data : comment
                )
            );
        } catch (error) {
            console.error('Error updating comment:', error);
            if (error.response?.data?.errors?.content) {
                throw new Error(error.response.data.errors.content[0]);
            } else {
                throw new Error('Failed to update comment');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            
            // Remove comment from the list
            setComments(prevComments =>
                prevComments.filter(comment => comment.id !== commentId)
            );
            
            // Update pagination count
            if (pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: prev.total - 1
                }));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error('Failed to delete comment');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-8">
            {/* Comments Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800">
                    Comments {pagination && `(${pagination.total})`}
                </h3>
            </div>

            {/* Comment Form */}
            <CommentForm onSubmit={handleSubmitComment} loading={submitting} />

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onUpdate={handleUpdateComment}
                            onDelete={handleDeleteComment}
                        />
                    ))}
                    
                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex justify-center pt-6">
                            <Pagination
                                currentPage={pagination.current_page}
                                totalPages={pagination.last_page}
                                onPageChange={handlePageChange}
                                showInfo={true}
                                totalItems={pagination.total}
                                itemsPerPage={pagination.per_page}
                                itemName="comment"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h4 className="text-xl font-semibold text-slate-600 mb-2">No comments yet</h4>
                        <p className="text-slate-500">
                            Be the first to share your thoughts on this post!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentList;