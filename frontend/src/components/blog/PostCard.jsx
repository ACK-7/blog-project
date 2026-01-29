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
        <Card className="hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-semibold">
                        {post.category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                        {formatDate(post.created_at)}
                    </span>
                </div>
                
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
                        <span className="ml-2 text-sm text-gray-700">
                            {post.author.name}
                        </span>
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