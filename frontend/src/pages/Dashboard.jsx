import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import DashboardPostCard from '../components/dashboard/DashboardPostCard';
import StatusFilter from '../components/dashboard/StatusFilter';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import { sweetAlert } from '../utils/sweetAlert';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [statusCounts, setStatusCounts] = useState({});
    
    const {
        currentPage,
        perPage,
        paginationData,
        handlePageChange,
        handlePerPageChange,
        updatePaginationData,
        getPaginationParams
    } = usePagination(9); // 9 posts per page for 3x3 grid

    useEffect(() => {
        fetchUserPosts();
    }, [currentPage, perPage, user.id, activeFilter]);

    const fetchUserPosts = async () => {
        setLoading(true);
        try {
            let endpoint = '/posts';
            const params = new URLSearchParams({
                ...getPaginationParams(),
                user_id: user.id
            });

            // Use specific endpoints for different statuses
            if (activeFilter === 'draft') {
                endpoint = '/posts/drafts';
                params.delete('user_id'); // Not needed for drafts endpoint
            } else if (activeFilter === 'scheduled') {
                endpoint = '/posts/scheduled';
                params.delete('user_id'); // Not needed for scheduled endpoint
            } else if (activeFilter !== 'all') {
                // For published or other specific statuses
                params.append('status', activeFilter);
            }
            
            const response = await api.get(`${endpoint}?${params}`);
            
            // Handle paginated response
            setPosts(response.data.data || []);
            
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
            console.error('Error fetching posts:', error);
            sweetAlert.error(
                'Failed to Load Posts',
                'There was an error loading your posts. Please try again.'
            );
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusCounts = async () => {
        try {
            // Fetch counts for each status
            const [allResponse, publishedResponse, draftResponse, scheduledResponse] = await Promise.all([
                api.get(`/posts?user_id=${user.id}&per_page=1`),
                api.get(`/posts?user_id=${user.id}&status=published&per_page=1`),
                api.get(`/posts/drafts?per_page=1`),
                api.get(`/posts/scheduled?per_page=1`)
            ]);

            setStatusCounts({
                all: allResponse.data.meta?.total || 0,
                published: publishedResponse.data.meta?.total || 0,
                draft: draftResponse.data.meta?.total || 0,
                scheduled: scheduledResponse.data.meta?.total || 0
            });
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        handlePageChange(1); // Reset to first page when changing filter
    };

    // Fetch status counts on component mount
    useEffect(() => {
        fetchStatusCounts();
    }, [user.id]);

    const handlePublish = async (postSlug, postTitle) => {
        const result = await sweetAlert.confirm(
            'Publish Draft?',
            `Are you sure you want to publish "${postTitle}"? It will become visible to all readers.`,
            'Yes, publish it',
            'Cancel'
        );

        if (result.isConfirmed) {
            try {
                sweetAlert.loading('Publishing Post...', 'Please wait while we publish your post.');
                
                // Get the current post data first
                const postResponse = await api.get(`/posts/${postSlug}`);
                const post = postResponse.data.data;
                
                // Update with current timestamp as published_at
                await api.put(`/posts/${postSlug}`, {
                    title: post.title,
                    content: post.content,
                    category_id: post.category.id,
                    published_at: new Date().toISOString().slice(0, 16)
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                // Refresh the posts and status counts
                await Promise.all([fetchUserPosts(), fetchStatusCounts()]);
                
                sweetAlert.success(
                    'Post Published!',
                    'Your post is now live and visible to all readers.'
                );
            } catch (error) {
                console.error('Error publishing post:', error);
                sweetAlert.error(
                    'Publish Failed',
                    'There was an error publishing your post. Please try again.'
                );
            }
        }
    };

    const handleDelete = async (postSlug, postTitle) => {
        const result = await sweetAlert.confirmDelete(
            'Delete Post?',
            `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
        );

        if (result.isConfirmed) {
            try {
                // Show loading
                sweetAlert.loading('Deleting Post...', 'Please wait while we delete your post.');
                
                await api.delete(`/posts/${postSlug}`);
                
                // Refresh the current page instead of filtering
                await fetchUserPosts();
                
                // Close loading and show success
                sweetAlert.success(
                    'Post Deleted!',
                    'Your post has been successfully deleted.'
                );
            } catch (error) {
                console.error('Error deleting post:', error);
                sweetAlert.error(
                    'Delete Failed',
                    'There was an error deleting your post. Please try again.'
                );
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-bold gradient-text mb-4">
                        My Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Manage your blog posts and track your writing journey
                    </p>
                </div>
                <Link to="/posts/create">
                    <Button size="lg" className="shadow-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Post
                        </div>
                    </Button>
                </Link>
            </div>

            {/* Status Filter */}
            <StatusFilter 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={statusCounts}
            />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : posts.length === 0 ? (
                <Card hover={false} className="text-center p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-4">No Posts Yet</h3>
                        <p className="text-slate-500 text-lg mb-8">
                            You haven't created any posts yet. Start sharing your thoughts with the world!
                        </p>
                        <Link to="/posts/create">
                            <Button size="lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Your First Post
                                </div>
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <DashboardPostCard 
                            key={post.id} 
                            post={post} 
                            onDelete={handleDelete}
                            onPublish={handlePublish}
                        />
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

export default Dashboard;