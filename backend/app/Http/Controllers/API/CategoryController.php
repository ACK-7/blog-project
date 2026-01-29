<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        // Use withCount for performance instead of loading all posts
        $categories = Category::withCount('posts')->get();
        
        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created category
     */
    public function store(StoreCategoryRequest $request)
    {
        // Validation already passed! Use validated data only
        $category = Category::create($request->validated());
        
        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category)
    {
        // Load posts relationship for detailed view
        $category->load('posts');
        
        return new CategoryResource($category);
    }

    /**
     * Update the specified category
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        // Validation already passed!
        $category->update($request->validated());
        
        return new CategoryResource($category);
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has posts
        if ($category->posts()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing posts'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
