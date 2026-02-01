import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

const DashboardPostCard = ({ post, onDelete, onPublish }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Featured Image */}
            {post.featured_image_url && (
                <div className="relative h-32 overflow-hidden">
                    <Link to={`/posts/${post.slug}`}>
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </Link>
                    <div className="absolute top-2 left-2">
                        <StatusBadge status={post.status} />
                    </div>
                    <div className="absolute top-2 right-2">
                        <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {post.category.name}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-6 flex-1 flex flex-col">
                {/* Category and Date - only show if no featured image */}
                {!post.featured_image_url && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={post.status} />
                            <span className="text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                {post.category.name}
                            </span>
                        </div>
                        <span className="text-sm text-slate-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                )}
                
                {/* Date and Status for posts with featured images */}
                {post.featured_image_url && (
                    <div className="mb-3 flex items-center justify-between">
                        <StatusBadge status={post.status} />
                        <span className="text-sm text-slate-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                )}
                
                {/* Title */}
                <Link to={`/posts/${post.slug}`} className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800 hover:text-blue-600 mb-3 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </Link>
                
                {/* Content Preview */}
                <p className="text-slate-600 mb-6 line-clamp-3 flex-1">
                    {post.content.substring(0, 120)}...
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                    <Link to={`/posts/${post.slug}/edit`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Button>
                    </Link>
                    
                    {/* Show Publish button for drafts */}
                    {post.status === 'draft' && onPublish && (
                        <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => onPublish(post.slug, post.title)}
                            className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Publish
                        </Button>
                    )}
                    
                    <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => onDelete(post.slug, post.title)}
                        className={`${post.status === 'draft' && onPublish ? 'px-3' : 'flex-1'} flex items-center justify-center`}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {post.status === 'draft' && onPublish ? '' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default DashboardPostCard;