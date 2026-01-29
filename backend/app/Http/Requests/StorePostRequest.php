<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or check: auth()->check()
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => auth()->id(),
            'slug' => $this->generateSlug($this->title),
            'status' => $this->status ?? 'draft',
        ]);
    }

    private function generateSlug($title)
    {
        if (!$title) return null;
        
        // Create base slug from title
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $slug = $baseSlug;
        $counter = 1;
        
        // Handle duplicates by appending numbers
        while (\App\Models\Post::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                'unique:posts,title'
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:posts,slug',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'
            ],
            'content' => [
                'required',
                'string',
                'min:50' // Blog posts should have substance
            ],
            'excerpt' => [
                'nullable',
                'string',
                'max:500'
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id'
            ],
            'featured_image' => [
                'nullable',
                'url'
            ],
            'status' => [
                'required',
                'in:draft,published,archived'
            ],
            'published_at' => [
                'nullable',
                'date',
                'after_or_equal:today'
            ],
            'tags' => [
                'nullable',
                'array'
            ],
            'tags.*' => [
                'string',
                'max:50'
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
            'status.in' => 'Status must be draft, published, or archived',
        ];
    }
}
