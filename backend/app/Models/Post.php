<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'featured_image',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the comments for the post.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the featured image URL attribute.
     */
    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image 
            ? url(\Storage::url($this->featured_image))
            : null;
    }

    /**
     * Get the post status based on published_at.
     */
    public function getStatusAttribute()
    {
        if (is_null($this->published_at)) {
            return 'draft';
        }
        
        if ($this->published_at->isFuture()) {
            return 'scheduled';
        }
        
        return 'published';
    }

    /**
     * Get human-readable status.
     */
    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'draft' => 'Draft',
            'scheduled' => 'Scheduled',
            'published' => 'Published',
            default => 'Unknown'
        };
    }

    /**
     * Check if post is published.
     */
    public function getIsPublishedAttribute()
    {
        return $this->status === 'published';
    }

    /**
     * Check if post is draft.
     */
    public function getIsDraftAttribute()
    {
        return $this->status === 'draft';
    }

    /**
     * Check if post is scheduled.
     */
    public function getIsScheduledAttribute()
    {
        return $this->status === 'scheduled';
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include draft posts.
     */
    public function scopeDrafts($query)
    {
        return $query->whereNull('published_at');
    }

    /**
     * Scope a query to only include scheduled posts.
     */
    public function scopeScheduled($query)
    {
        return $query->whereNotNull('published_at')
                     ->where('published_at', '>', now());
    }
}
