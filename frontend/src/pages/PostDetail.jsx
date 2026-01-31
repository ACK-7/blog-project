import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CommentList from '../components/comments/CommentList';
import { sweetAlert } from '../utils/sweetAlert';

const PostDetail = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${slug}`);
            setPost(response.data.data);
        } catch (error) {
            console.error('Error fetching post:', error);
            sweetAlert.error(
                'Post Not Found',
                'The post you are looking for could not be found.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const result = await sweetAlert.confirmDelete(
            'Delete Post?',
            `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
        );

        if (result.isConfirmed) {
            try {
                sweetAlert.loading('Deleting Post...', 'Please wait while we delete your post.');
                
                await api.delete(`/posts/${slug}`);
                
                sweetAlert.success(
                    'Post Deleted!',
                    'Your post has been successfully deleted.'
                ).then(() => {
                    navigate('/dashboard');
                });
            } catch (error) {
                console.error('Error deleting post:', error);
                sweetAlert.error(
                    'Delete Failed',
                    'There was an error deleting your post. Please try again.'
                );
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-slate-700 mb-4">Post Not Found</h3>
                    <p className="text-slate-500 text-lg mb-8">
                        The post you are looking for doesn't exist or has been removed.
                    </p>
                    <Link to="/">
                        <Button>Back to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthor = user && user.id === post.author.id;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center font-medium transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to all posts
            </Link>

            <Card hover={false} className="overflow-hidden">
                {/* Featured Image */}
                {post.featured_image_url && (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-8 right-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-block bg-white/90 backdrop-blur-sm text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                                    {post.category.name}
                                </span>
                                <span className="text-white/90 text-sm flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(post.created_at)}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                )}
                
                <div className="p-8">
                    {/* Category and Date - only show if no featured image */}
                    {!post.featured_image_url && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                                    {post.category.name}
                                </span>
                                <span className="text-slate-500 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(post.created_at)}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl font-bold gradient-text mb-8 leading-tight">
                                {post.title}
                            </h1>
                        </>
                    )}

                    {/* Author */}
                    <div className="flex items-center mb-8 pb-8 border-b border-slate-200">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                            {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                            <p className="text-slate-800 font-bold text-lg">{post.author.name}</p>
                            <p className="text-slate-600">{post.author.email}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none mb-8">
                        <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Edit/Delete Buttons (only for author) */}
                    {isAuthor && (
                        <div className="flex gap-4 pt-8 border-t border-slate-200">
                            <Link to={`/posts/${post.slug}/edit`}>
                                <Button variant="primary" className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Post
                                </Button>
                            </Link>
                            <Button variant="danger" onClick={handleDelete} className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Post
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Comments Section */}
            <div className="mt-12">
                <CommentList postSlug={slug} />
            </div>
        </div>
    );
};

export default PostDetail;