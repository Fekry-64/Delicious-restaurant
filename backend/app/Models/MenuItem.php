<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'price',
        'category',
        'image',
        'is_available',
        'sort_order'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    // Accessors for localized content
    public function getNameAttribute($value)
    {
        $locale = app()->getLocale();
        return $this->{"name_{$locale}"} ?? $this->name_en;
    }

    public function getDescriptionAttribute($value)
    {
        $locale = app()->getLocale();
        return $this->{"description_{$locale}"} ?? $this->description_en;
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name_en');
    }
}
