import { useState, useEffect } from 'react';
import api from '../api/axios';
import PostList from '../components/blog/PostList';
import CategoryFilter from '../components/blog/CategoryFilter';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const {
        currentPage,
        perPage,
        paginationData,
        handlePageChange,
        handlePerPageChange,
        updatePaginationData,
        getPaginationParams,
        reset
    } = usePagination(12);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, currentPage, perPage]);

    // Reset pagination when category changes
    useEffect(() => {
        if (selectedCategory !== null) {
            reset();
        }
    }, [selectedCategory]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...getPaginationParams(),
                ...(selectedCategory && { category_id: selectedCategory })
            });
            
            const response = await api.get(`/posts?${params}`);
            
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
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="float">
                    <h1 className="text-6xl font-bold gradient-text mb-6">
                        Welcome to MyBlog
                    </h1>
                </div>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                    Discover amazing articles and stories from our community of passionate writers
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>

            <CategoryFilter 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <PostList posts={posts} loading={loading} />
            
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

export default Home;