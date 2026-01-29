import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { sweetAlert } from '../utils/sweetAlert';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        status: 'draft',
        published_at: ''
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            sweetAlert.error(
                'Failed to Load Categories',
                'There was an error loading categories. Please refresh the page.'
            );
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        // Client-side validation
        const clientErrors = {};
        
        if (!formData.title.trim()) {
            clientErrors.title = ['Title is required'];
        }
        
        if (!formData.content.trim()) {
            clientErrors.content = ['Content is required'];
        } else if (formData.content.length < 50) {
            clientErrors.content = ['Content must be at least 50 characters'];
        }
        
        if (!formData.category_id) {
            clientErrors.category_id = ['Category is required'];
        }
        
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }
        
        setLoading(true);

        try {
            const response = await api.post('/posts', formData);
            
            // Show success alert
            sweetAlert.success(
                'Post Created Successfully!',
                'Your post has been created and is ready to be shared.'
            ).then(() => {
                navigate(`/posts/${response.data.data.slug}`);
            });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                sweetAlert.toast.error('Please fix the validation errors below');
            } else {
                setErrors({ 
                    general: error.response?.data?.message || 'Failed to create post' 
                });
                sweetAlert.error(
                    'Failed to Create Post',
                    'There was an error creating your post. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">Create New Post</h1>
                <p className="text-slate-600 text-lg">Share your thoughts with the world</p>
            </div>

            <Card hover={false} className="p-8">
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Post Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title?.[0]}
                        placeholder="Enter an engaging title for your post"
                        required
                    />

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.category_id[0]}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                            required
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        {errors.status && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.status[0]}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300 placeholder-slate-400 resize-none"
                            placeholder="Write your post content here... Share your thoughts, experiences, and insights with the community."
                            required
                            minLength="50"
                        />
                        {errors.content && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.content[0]}
                            </p>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm text-slate-500">
                                {formData.content.length}/50 characters minimum
                            </p>
                            <div className={`text-sm font-medium ${formData.content.length >= 50 ? 'text-green-600' : 'text-slate-400'}`}>
                                {formData.content.length >= 50 ? '✓ Good to go!' : 'Keep writing...'}
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Publish Date (Optional)"
                        type="datetime-local"
                        name="published_at"
                        value={formData.published_at}
                        onChange={handleChange}
                        error={errors.published_at?.[0]}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Post...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Post
                                </div>
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1"
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </div>
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreatePost;