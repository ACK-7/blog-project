<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * This protects against mass assignment vulnerabilities.
     * Only these fields can be filled using create() or update() methods.
      **/

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Define the relationship with the Post model.
     * A category can have many posts.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
