<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
            'content' => [
                'required',
                'string',
                'min:50'
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id'
            ],
            'featured_image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:2048', // 2MB max
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
            'content.min' => 'Post content must be at least 50 characters',
            'category_id.exists' => 'The selected category does not exist',
            'featured_image.image' => 'Featured image must be a valid image file',
            'featured_image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file',
            'featured_image.max' => 'Featured image must not be larger than 2MB',
            'featured_image.dimensions' => 'Featured image must be between 300x200 and 2000x2000 pixels',
        ];
    }
}
