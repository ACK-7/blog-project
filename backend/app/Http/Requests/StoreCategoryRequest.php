<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:categories,name',
                'regex:/^[a-zA-Z\s]+$/' // Only letters and spaces allowed
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:categories,slug',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required',
            'name.unique' => 'A category with this name already exists',
            'name.regex' => 'Category name can only contain letters and spaces',
            'slug.required' => 'Category slug is required',
            'slug.unique' => 'A category with this slug already exists',
            'slug.regex' => 'Slug must contain only lowercase letters, numbers, and hyphens',
        ];
    }
}