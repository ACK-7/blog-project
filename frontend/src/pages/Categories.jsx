import { useState, useEffect } from 'react';
import api from '../api/axios';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import { sweetAlert } from '../utils/sweetAlert';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            sweetAlert.error(
                'Failed to Load Categories',
                'There was an error loading categories. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name) => {
        if (!name) return '';
        
        return name
            .toLowerCase()
            .trim()
            // Replace spaces and special characters with hyphens
            .replace(/[^a-z0-9]+/g, '-')
            // Remove multiple consecutive hyphens
            .replace(/-+/g, '-')
            // Remove leading/trailing hyphens
            .replace(/^-|-$/g, '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate slug when name changes
            ...(name === 'name' && { slug: generateSlug(value) })
        }));
        
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: ''
        });
        setEditingCategory(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        try {
            if (editingCategory) {
                // Update existing category
                await api.put(`/categories/${editingCategory.slug}`, formData);
                sweetAlert.success(
                    'Category Updated!',
                    'The category has been successfully updated.'
                );
            } else {
                // Create new category
                await api.post('/categories', formData);
                sweetAlert.success(
                    'Category Created!',
                    'The new category has been successfully created.'
                );
            }
            
            // Refetch all categories to get updated post counts
            await fetchCategories();
            resetForm();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                sweetAlert.error(
                    'Operation Failed',
                    error.response?.data?.message || 'There was an error processing your request.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || ''
        });
        setErrors({});
    };

    const handleDelete = async (category) => {
        const result = await sweetAlert.confirmDelete(
            'Delete Category?',
            `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        );

        if (result.isConfirmed) {
            try {
                await api.delete(`/categories/${category.slug}`);
                // Refetch all categories to get updated post counts
                await fetchCategories();
                sweetAlert.success(
                    'Category Deleted!',
                    'The category has been successfully deleted.'
                );
            } catch (error) {
                sweetAlert.error(
                    'Delete Failed',
                    error.response?.data?.message || 'There was an error deleting the category.'
                );
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">
                    Category Management
                </h1>
                <p className="text-slate-600 text-lg">
                    Organize your content with custom categories
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Form */}
                <div className="lg:col-span-1">
                    <Card hover={false} className="p-6 sticky top-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </h2>

                        <form onSubmit={handleSubmit} noValidate>
                            <Input
                                label="Category Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name?.[0]}
                                placeholder="e.g., Technology, Travel, Food"
                                required
                                helpText="Only letters and spaces are allowed"
                            />

                            <Input
                                label="Slug"
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                error={errors.slug?.[0]}
                                placeholder="category-slug"
                                required
                                helpText="URL-friendly version of the name"
                            />

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white hover:border-slate-300 placeholder-slate-400 resize-none"
                                    placeholder="Brief description of this category"
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.description[0]}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="flex-1"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {editingCategory ? 'Updating...' : 'Creating...'}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editingCategory ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                                            </svg>
                                            {editingCategory ? 'Update Category' : 'Create Category'}
                                        </div>
                                    )}
                                </Button>

                                {editingCategory && (
                                    <Button 
                                        type="button" 
                                        variant="secondary"
                                        onClick={resetForm}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner size="lg" />
                        </div>
                    ) : categories.length === 0 ? (
                        <Card hover={false} className="text-center p-16">
                            <div className="max-w-md mx-auto">
                                <svg className="w-24 h-24 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-slate-700 mb-4">No Categories Yet</h3>
                                <p className="text-slate-500 text-lg">
                                    Create your first category to start organizing your posts.
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <Card key={category.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-800">
                                                    {category.name}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {category.posts_count || 0} posts
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2">
                                                Slug: <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">{category.slug}</code>
                                            </p>
                                            {category.description && (
                                                <p className="text-slate-600">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                                className="flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(category)}
                                                className="flex items-center"
                                                disabled={category.posts_count > 0}
                                                title={category.posts_count > 0 ? 'Cannot delete category with existing posts' : 'Delete category'}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;