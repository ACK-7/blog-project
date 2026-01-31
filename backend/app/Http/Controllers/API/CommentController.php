<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display comments for a specific post.
     * GET /api/posts/{post}/comments
     */
    public function index(Post $post, Request $request)
    {
        $perPage = min((int)$request->get('per_page', 10), 50); // Default 10, max 50
        
        $comments = $post->comments()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created comment.
     * POST /api/posts/{post}/comments
     */
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:1000',
        ], [
            'content.required' => 'Comment content is required.',
            'content.min' => 'Comment must be at least 3 characters long.',
            'content.max' => 'Comment cannot exceed 1000 characters.',
        ]);

        $comment = $post->comments()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        // Load the user relationship for the response
        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Update the specified comment.
     * PUT /api/comments/{comment}
     */
    public function update(Request $request, Comment $comment)
    {
        // Authorization: Only the comment author can update their comment
        if (auth()->id() !== $comment->user_id) {
            return response()->json([
                'message' => 'You are not authorized to update this comment.'
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:1000',
        ], [
            'content.required' => 'Comment content is required.',
            'content.min' => 'Comment must be at least 3 characters long.',
            'content.max' => 'Comment cannot exceed 1000 characters.',
        ]);

        $comment->update($validated);
        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Remove the specified comment (Soft Delete).
     * DELETE /api/comments/{comment}
     */
    public function destroy(Comment $comment)
    {
        // Authorization: Comment author or post author can delete the comment
        if (auth()->id() !== $comment->user_id && auth()->id() !== $comment->post->user_id) {
            return response()->json([
                'message' => 'You are not authorized to delete this comment.'
            ], 403);
        }

        $comment->delete(); // Soft delete

        return response()->json([
            'message' => 'Comment deleted successfully'
        ], 200);
    }
}
