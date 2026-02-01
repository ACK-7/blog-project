import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ImageUpload from '../components/common/ImageUpload';
import CategoryModal from '../components/common/CategoryModal';
import { sweetAlert } from '../utils/sweetAlert';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [featuredImage, setFeaturedImage] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            sweetAlert.error(
                'Failed to Load Categories',
                'There was an error loading categories. Please refresh the page.'
            );
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Helper function to check if the selected date is in the future
    const isScheduledPost = () => {
        return false; // No scheduling anymore
    };

    // Helper function to get the correct action for submission
    const getPublishAction = () => {
        return 'publish'; // Always publish when not saving as draft
    };

    const handleCategoryCreated = (newCategory) => {
        // Add the new category to the list
        setCategories(prev => [newCategory, ...prev]);
        // Auto-select the new category
        setFormData(prev => ({
            ...prev,
            category_id: newCategory.id
        }));
        // Ensure categories are no longer loading
        setCategoriesLoading(false);
    };

    const handleSubmit = async (e, action = 'publish') => {
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
            // Create FormData for file upload
            const submitData = new FormData();
            
            // Append form fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });
            
            // Handle published_at based on action
            if (action === 'publish') {
                // Set to now for immediate publishing
                const publishTime = new Date().toISOString().slice(0, 16);
                submitData.append('published_at', publishTime);
                console.log('Publishing post with published_at:', publishTime);
            } else {
                console.log('Saving as draft (no published_at)');
            }
            // For drafts, don't append published_at (leave it null)
            
            // Append image if selected
            if (featuredImage) {
                submitData.append('featured_image', featuredImage);
            }
            
            const response = await api.post('/posts', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Show success alert based on action
            const messages = {
                draft: {
                    title: 'Draft Saved Successfully!',
                    text: 'Your post has been saved as a draft.'
                },
                publish: {
                    title: 'Post Published Successfully!',
                    text: 'Your post is now live and visible to readers.'
                }
            };
            
            const message = messages[action] || messages.publish;
            
            sweetAlert.success(message.title, message.text).then(() => {
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

                    <ImageUpload
                        onImageSelect={setFeaturedImage}
                        onImageRemove={() => setFeaturedImage(null)}
                        className="mb-6"
                        disabled={loading}
                    />
                    {errors.featured_image && (
                        <p className="mt-2 mb-4 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.featured_image[0]}
                        </p>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category
                        </label>
                        <div className="flex gap-2">
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                                required
                                disabled={categoriesLoading}
                            >
                                <option value="">
                                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                                </option>
                                {!categoriesLoading && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCategoryModal(true)}
                                className="px-4 py-3 flex items-center justify-center"
                                title="Create new category"
                                disabled={categoriesLoading}
                            >
                                {categoriesLoading ? (
                                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </Button>
                        </div>
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

                    <div className="flex gap-3 pt-4">
                        <Button 
                            type="button" 
                            onClick={(e) => handleSubmit(e, 'draft')}
                            variant="secondary"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Save Draft
                                </div>
                            )}
                        </Button>
                        
                        <Button 
                            type="submit" 
                            onClick={(e) => handleSubmit(e, 'publish')}
                            disabled={loading} 
                            className="flex-1"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Publish Now
                                </div>
                            )}
                        </Button>
                        
                        <Button 
                            type="button" 
                            variant="secondary"
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                            className="px-4"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Category Modal */}
            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onCategoryCreated={handleCategoryCreated}
            />
        </div>
    );
};

export default CreatePost;