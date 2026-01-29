<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Check if user owns this post
        // return $this->user()->id === $this->route('post')->user_id;
        return true;
    }

    protected function prepareForValidation()
    {
        // Only regenerate slug if title is being updated
        if ($this->has('title') && $this->title) {
            $this->merge([
                'slug' => $this->generateSlug($this->title, $this->route('post')),
            ]);
        }
    }

    private function generateSlug($title, $currentPost = null)
    {
        if (!$title) return null;
        
        // Create base slug from title
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $slug = $baseSlug;
        $counter = 1;
        
        // Handle duplicates by appending numbers (exclude current post)
        $query = \App\Models\Post::where('slug', $slug);
        if ($currentPost) {
            $query->where('id', '!=', $currentPost->id);
        }
        
        while ($query->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
            
            $query = \App\Models\Post::where('slug', $slug);
            if ($currentPost) {
                $query->where('id', '!=', $currentPost->id);
            }
        }
        
        return $slug;
    }

    public function rules(): array
    {
        $postId = $this->route('post');

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'title')->ignore($postId)
            ],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'slug')->ignore($postId),
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'
            ],
            'content' => [
                'sometimes',
                'required',
                'string',
                'min:50'
            ],
            'excerpt' => [
                'nullable',
                'string',
                'max:500'
            ],
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:categories,id'
            ],
            'featured_image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:2048',
                'dimensions:min_width=300,min_height=200,max_width=2000,max_height=2000'
            ],
            'published_at' => [
                'nullable',
                'date'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'title.unique' => 'A post with this title already exists',
            'slug.unique' => 'A post with this slug already exists',
            'content.min' => 'Post content must be at least 50 characters',
            'category_id.exists' => 'The selected category does not exist',
            'featured_image.image' => 'Featured image must be a valid image file',
            'featured_image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file',
            'featured_image.max' => 'Featured image must not be larger than 2MB',
            'featured_image.dimensions' => 'Featured image must be between 300x200 and 2000x2000 pixels',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'featured_image' => 'featured image URL',
            'published_at' => 'publication date',
        ];
    }
}
