import { Link } from 'react-router-dom';
import Card from '../common/Card';

const PostCard = ({ post }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Featured Image */}
            {post.featured_image_url && (
                <div className="relative h-48 overflow-hidden">
                    <Link to={`/posts/${post.slug}`}>
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </Link>
                    <div className="absolute top-3 left-3">
                        <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {post.category.name}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-6">
                {/* Category and Date - only show if no featured image */}
                {!post.featured_image_url && (
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600 font-semibold">
                            {post.category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                )}
                
                <Link to={`/posts/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                    </h2>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-2">
                            <span className="text-sm text-gray-700 block">
                                {post.author.name}
                            </span>
                            {post.featured_image_url && (
                                <span className="text-xs text-gray-500">
                                    {formatDate(post.created_at)}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <Link to={`/posts/${post.slug}`}>
                        <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Read more →
                        </span>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default PostCard;