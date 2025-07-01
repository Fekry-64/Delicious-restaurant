<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value_en',
        'value_ar',
        'type'
    ];

    // Accessor for localized value
    public function getValueAttribute($value)
    {
        $locale = app()->getLocale();
        return $this->{"value_{$locale}"} ?? $this->value_en;
    }

    // Static methods for easy access
    public static function getValue($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setValue($key, $valueEn, $valueAr = null, $type = 'text')
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value_en' => $valueEn,
                'value_ar' => $valueAr,
                'type' => $type
            ]
        );
    }
}
