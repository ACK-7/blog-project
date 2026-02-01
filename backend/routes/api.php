<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\CommentController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public - anyone can view categories and posts
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post:slug}/comments', [CommentController::class, 'index']); // Public: view comments

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Categories - only authenticated users
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category:slug}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category:slug}', [CategoryController::class, 'destroy']);

    // Posts - Specific routes MUST come before parameterized routes
    Route::get('/posts/trashed', [PostController::class, 'trashed']); // Get trashed posts
    Route::get('/posts/drafts', [PostController::class, 'drafts']); // Get draft posts
    Route::post('/posts/{slug}/restore', [PostController::class, 'restore']); // Restore post
    Route::delete('/posts/{slug}/force', [PostController::class, 'forceDestroy']); // Hard delete
    Route::delete('/posts/{post:slug}/image', [PostController::class, 'removeImage']); // Remove featured image
    
    // Comments - Protected routes
    Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store']); // Create comment
    Route::put('/comments/{comment}', [CommentController::class, 'update']); // Update comment
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']); // Delete comment
    
    // Posts - General CRUD (these come after specific routes)
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post:slug}', [PostController::class, 'update']);
    Route::delete('/posts/{post:slug}', [PostController::class, 'destroy']); // Soft delete
});

// Public parameterized routes - MUST come after all specific routes
Route::get('/posts/{post:slug}', [PostController::class, 'show']);