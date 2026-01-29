import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import { sweetAlert } from '../utils/sweetAlert';

const Trash = () => {
    const { user } = useAuth();
    const [trashedPosts, setTrashedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const {
        currentPage,
        perPage,
        paginationData,
        handlePageChange,
        handlePerPageChange,
        updatePaginationData,
        getPaginationParams
    } = usePagination(9);

    useEffect(() => {
        fetchTrashedPosts();
    }, [currentPage, perPage]);

    const fetchTrashedPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(getPaginationParams());
            const response = await api.get(`/posts/trashed?${params}`);
            
            // Handle paginated response
            setTrashedPosts(response.data.data || []);
            
            // Update pagination data from Laravel pagination format
            if (response.data.meta) {
                updatePaginationData(response.data.meta);
            } else if (response.data.current_page) {
                // Fallback for direct Laravel pagination format
                updatePaginationData({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    total: response.data.total,
                    per_page: response.data.per_page,
                    from: response.data.from,
                    to: response.data.to
                });
            }
        } catch (error) {
            console.error('Error fetching trashed posts:', error);
            sweetAlert.error(
                'Failed to Load Trash',
                'There was an error loading your deleted posts.'
            );
            setTrashedPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (postSlug, postTitle) => {
        const result = await sweetAlert.confirm(
            'Restore Post?',
            `Are you sure you want to restore "${postTitle}"?`,
            'Yes, restore it!',
            'Cancel'
        );

        if (result.isConfirmed) {
            try {
                sweetAlert.loading('Restoring Post...', 'Please wait while we restore your post.');
                
                await api.post(`/posts/${postSlug}/restore`);
                
                // Refresh the current page
                await fetchTrashedPosts();
                
                sweetAlert.success(
                    'Post Restored!',
                    'Your post has been successfully restored and is now visible again.'
                );
            } catch (error) {
                console.error('Error restoring post:', error);
                sweetAlert.error(
                    'Restore Failed',
                    'There was an error restoring your post. Please try again.'
                );
            }
        }
    };

    const handlePermanentDelete = async (postSlug, postTitle) => {
        const result = await sweetAlert.confirmDelete(
            'Permanently Delete Post?',
            `Are you sure you want to permanently delete "${postTitle}"? This action CANNOT be undone and the post will be lost forever.`
        );

        if (result.isConfirmed) {
            try {
                sweetAlert.loading('Permanently Deleting...', 'Please wait while we permanently delete your post.');
                
                await api.delete(`/posts/${postSlug}/force`);
                
                // Refresh the current page
                await fetchTrashedPosts();
                
                sweetAlert.success(
                    'Post Permanently Deleted!',
                    'Your post has been permanently removed and cannot be recovered.'
                );
            } catch (error) {
                console.error('Error permanently deleting post:', error);
                sweetAlert.error(
                    'Delete Failed',
                    'There was an error permanently deleting your post. Please try again.'
                );
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-bold gradient-text mb-4">
                        🗑️ Trash
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Manage your deleted posts - restore or permanently delete them
                    </p>
                </div>
                <Link to="/dashboard">
                    <Button variant="secondary" className="shadow-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </div>
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : trashedPosts.length === 0 ? (
                <Card hover={false} className="text-center p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-4">Trash is Empty</h3>
                        <p className="text-slate-500 text-lg mb-8">
                            You don't have any deleted posts. Deleted posts will appear here and can be restored.
                        </p>
                        <Link to="/dashboard">
                            <Button>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Dashboard
                                </div>
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trashedPosts.map((post) => (
                        <Card key={post.id} className="h-full flex flex-col opacity-75">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                                        Deleted
                                    </span>
                                    <span className="text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                        {post.category.name}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-600 mb-3 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 line-clamp-3 flex-1 mb-4">
                                    {post.content.substring(0, 120)}...
                                </p>
                                <div className="text-sm text-slate-500 flex items-center mb-4">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Deleted {new Date(post.deleted_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => handleRestore(post.slug, post.title)}
                                        className="flex-1 flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Restore
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handlePermanentDelete(post.slug, post.title)}
                                        className="flex-1 flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Forever
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            
            <Pagination
                currentPage={paginationData.current_page}
                lastPage={paginationData.last_page}
                total={paginationData.total}
                perPage={paginationData.per_page}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                loading={loading}
            />
        </div>
    );
};

export default Trash;