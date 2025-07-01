<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    /**
     * Get all site settings
     */
    public function settings()
    {
        $settings = SiteSetting::all()->keyBy('key');
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Get contact information
     */
    public function contact()
    {
        $contactInfo = [
            'phone' => SiteSetting::getValue('phone'),
            'email' => SiteSetting::getValue('email'),
            'address_en' => SiteSetting::getValue('address_en'),
            'address_ar' => SiteSetting::getValue('address_ar'),
            'google_maps_url' => SiteSetting::getValue('google_maps_url'),
            'opening_hours_en' => SiteSetting::getValue('opening_hours_en'),
            'opening_hours_ar' => SiteSetting::getValue('opening_hours_ar'),
        ];

        return response()->json([
            'success' => true,
            'data' => $contactInfo
        ]);
    }

    /**
     * Get restaurant information
     */
    public function info()
    {
        $info = [
            'name_en' => SiteSetting::getValue('restaurant_name_en', 'Restaurant Name'),
            'name_ar' => SiteSetting::getValue('restaurant_name_ar', 'اسم المطعم'),
            'description_en' => SiteSetting::getValue('description_en'),
            'description_ar' => SiteSetting::getValue('description_ar'),
            'logo' => SiteSetting::getValue('logo'),
            'hero_image' => SiteSetting::getValue('hero_image'),
        ];

        return response()->json([
            'success' => true,
            'data' => $info
        ]);
    }

    /**
     * Get social media links
     */
    public function social()
    {
        $social = [
            'facebook' => SiteSetting::getValue('facebook_url'),
            'instagram' => SiteSetting::getValue('instagram_url'),
            'twitter' => SiteSetting::getValue('twitter_url'),
            'youtube' => SiteSetting::getValue('youtube_url'),
        ];

        return response()->json([
            'success' => true,
            'data' => $social
        ]);
    }

    /**
     * Get all site data for frontend
     */
    public function all()
    {
        $data = [
            'info' => [
                'name_en' => SiteSetting::getValue('restaurant_name_en', 'Restaurant Name'),
                'name_ar' => SiteSetting::getValue('restaurant_name_ar', 'اسم المطعم'),
                'description_en' => SiteSetting::getValue('description_en'),
                'description_ar' => SiteSetting::getValue('description_ar'),
                'logo' => SiteSetting::getValue('logo'),
                'hero_image' => SiteSetting::getValue('hero_image'),
            ],
            'contact' => [
                'phone' => SiteSetting::getValue('phone'),
                'email' => SiteSetting::getValue('email'),
                'address_en' => SiteSetting::getValue('address_en'),
                'address_ar' => SiteSetting::getValue('address_ar'),
                'google_maps_url' => SiteSetting::getValue('google_maps_url'),
                'opening_hours_en' => SiteSetting::getValue('opening_hours_en'),
                'opening_hours_ar' => SiteSetting::getValue('opening_hours_ar'),
            ],
            'social' => [
                'facebook' => SiteSetting::getValue('facebook_url'),
                'instagram' => SiteSetting::getValue('instagram_url'),
                'twitter' => SiteSetting::getValue('twitter_url'),
                'youtube' => SiteSetting::getValue('youtube_url'),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
