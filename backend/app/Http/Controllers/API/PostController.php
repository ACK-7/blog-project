<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     * GET /api/posts
     */
    public function index(Request $request)
    {
        // Start query with eager loading and order by latest first
        $query = Post::with(['user', 'category'])->orderBy('created_at', 'desc');

        // Filter by user if provided (for dashboard)
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by published posts only
        if ($request->has('published')) {
            $query->whereNotNull('published_at')
                  ->where('published_at', '<=', now());
        }

        // Always paginate with default or requested per_page
        $perPage = min((int)$request->get('per_page', 12), 100); // Default 12, max 100
        $posts = $query->paginate($perPage);

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created post.
     * POST /api/posts
     */
    public function store(StorePostRequest $request)
    {
        // user_id is automatically added in prepareForValidation
        $post = Post::create($request->all());

        // Load relationships for the response
        $post->load(['user', 'category']);

        return new PostResource($post);
    }

    /**
     * Display the specified post.
     * GET /api/posts/{slug}
     */
    public function show(Post $post)
    {
        // Load relationships
        $post->load(['user', 'category']);

        return new PostResource($post);
    }

    /**
     * Update the specified post.
     * PUT/PATCH /api/posts/{slug}
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        // Authorization: Only the author can update their post
        if (auth()->id() !== $post->user_id) {
            return response()->json([
                'message' => 'You are not authorized to update this post.'
            ], 403);
        }

        $post->update($request->all());

        // Reload relationships
        $post->load(['user', 'category']);

        return new PostResource($post);
    }

    /**
     * Remove the specified post (Soft Delete).
     * DELETE /api/posts/{slug}
     */
    public function destroy(Post $post)
    {
        // Authorization: Only the author can delete their post
        if (auth()->id() !== $post->user_id) {
            return response()->json([
                'message' => 'You are not authorized to delete this post.'
            ], 403);
        }

        $post->delete(); // Soft delete - sets deleted_at timestamp

        return response()->json([
            'message' => 'Post deleted successfully'
        ], 200);
    }

    /**
     * Restore a soft-deleted post.
     * POST /api/posts/{slug}/restore
     */
    public function restore($slug)
    {
        $post = Post::withTrashed()->where('slug', $slug)->first();
        
        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        // Authorization: Only the author can restore their post
        if (auth()->id() !== $post->user_id) {
            return response()->json([
                'message' => 'You are not authorized to restore this post.'
            ], 403);
        }

        $post->restore(); // Removes deleted_at timestamp
        $post->load(['user', 'category']);

        return response()->json([
            'message' => 'Post restored successfully',
            'data' => new PostResource($post)
        ], 200);
    }

    /**
     * Permanently delete a post (Hard Delete).
     * DELETE /api/posts/{slug}/force
     */
    public function forceDestroy($slug)
    {
        $post = Post::withTrashed()->where('slug', $slug)->first();
        
        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        // Authorization: Only the author can permanently delete their post
        if (auth()->id() !== $post->user_id) {
            return response()->json([
                'message' => 'You are not authorized to permanently delete this post.'
            ], 403);
        }

        $post->forceDelete(); // Permanently removes from database

        return response()->json([
            'message' => 'Post permanently deleted'
        ], 200);
    }

    /**
     * Get user's trashed posts.
     * GET /api/posts/trashed
     */
    public function trashed(Request $request)
    {
        $query = Post::onlyTrashed()
            ->where('user_id', auth()->id())
            ->with(['user', 'category'])
            ->orderBy('deleted_at', 'desc'); // Latest deleted first

        // Always paginate with default or requested per_page
        $perPage = min((int)$request->get('per_page', 9), 100); // Default 9, max 100
        $trashedPosts = $query->paginate($perPage);

        return PostResource::collection($trashedPosts);
    }
}
