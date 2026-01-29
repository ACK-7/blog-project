import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { sweetAlert } from '../utils/sweetAlert';

const EditPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        published_at: ''
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const [postResponse, categoriesResponse] = await Promise.all([
                api.get(`/posts/${slug}`),
                api.get('/categories')
            ]);

            const post = postResponse.data.data;
            setFormData({
                title: post.title,
                content: post.content,
                category_id: post.category.id,
                published_at: post.published_at || ''
            });
            setCategories(categoriesResponse.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            sweetAlert.error(
                'Failed to Load Post',
                'There was an error loading the post data. Please try again.'
            ).then(() => {
                navigate('/dashboard');
            });
        } finally {
            setLoading(false);
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
        setSubmitting(true);

        try {
            await api.put(`/posts/${slug}`, formData);
            
            // Show success alert
            sweetAlert.success(
                'Post Updated Successfully!',
                'Your changes have been saved.'
            ).then(() => {
                navigate(`/posts/${slug}`);
            });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                sweetAlert.toast.error('Please fix the validation errors below');
            } else {
                setErrors({ 
                    general: error.response?.data?.message || 'Failed to update post' 
                });
                sweetAlert.error(
                    'Failed to Update Post',
                    'There was an error updating your post. Please try again.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">Edit Post</h1>
                <p className="text-slate-600 text-lg">Update your post content</p>
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
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300 placeholder-slate-400 resize-none"
                            required
                        />
                        {errors.content && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.content[0]}
                            </p>
                        )}
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
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Post...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update Post
                                </div>
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary"
                            onClick={() => navigate(`/posts/${slug}`)}
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

export default EditPost;