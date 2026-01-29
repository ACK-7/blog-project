<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Date format constant for consistent formatting across the resource
     */
    private const DATE_FORMAT = 'Y-m-d H:i:s';

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'published_at' => $this->published_at ? $this->published_at->format(self::DATE_FORMAT) : null,
            
            // Include related data
            'author' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            
            'created_at' => $this->created_at->format(self::DATE_FORMAT),
            'updated_at' => $this->updated_at->format(self::DATE_FORMAT),
        ];
    }
}
