<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * This defines how your Category model will be formatted in JSON
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            
            // Only include posts_count if posts relationship is loaded (N+1 prevention)
            'posts_count' => $this->when($this->relationLoaded('posts'), fn() => $this->posts->count()),
            
            // Alternative: use withCount in query for better performance
            // 'posts_count' => $this->posts_count ?? 0,
            
            // Conditionally include full posts if requested
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
