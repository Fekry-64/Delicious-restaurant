<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Restaurant Information
            ['key' => 'restaurant_name_en', 'value_en' => 'Delicious Restaurant', 'value_ar' => 'مطعم لذيذ', 'type' => 'text'],
            ['key' => 'restaurant_name_ar', 'value_en' => 'Delicious Restaurant', 'value_ar' => 'مطعم لذيذ', 'type' => 'text'],
            ['key' => 'description_en', 'value_en' => 'Experience the finest dining with our carefully crafted menu featuring fresh ingredients and authentic flavors.', 'value_ar' => 'استمتع بأفضل المأكولات مع قائمتنا المصممة بعناية والتي تحتوي على مكونات طازجة ونكهات أصيلة.', 'type' => 'textarea'],
            ['key' => 'description_ar', 'value_en' => 'Experience the finest dining with our carefully crafted menu featuring fresh ingredients and authentic flavors.', 'value_ar' => 'استمتع بأفضل المأكولات مع قائمتنا المصممة بعناية والتي تحتوي على مكونات طازجة ونكهات أصيلة.', 'type' => 'textarea'],
            
            // Contact Information
            ['key' => 'phone', 'value_en' => '+1 (555) 123-4567', 'value_ar' => '+1 (555) 123-4567', 'type' => 'phone'],
            ['key' => 'email', 'value_en' => 'info@deliciousrestaurant.com', 'value_ar' => 'info@deliciousrestaurant.com', 'type' => 'email'],
            ['key' => 'address_en', 'value_en' => '123 Main Street, Downtown, City, State 12345', 'value_ar' => '123 الشارع الرئيسي، وسط المدينة، المدينة، الولاية 12345', 'type' => 'textarea'],
            ['key' => 'address_ar', 'value_en' => '123 Main Street, Downtown, City, State 12345', 'value_ar' => '123 الشارع الرئيسي، وسط المدينة، المدينة، الولاية 12345', 'type' => 'textarea'],
            ['key' => 'google_maps_url', 'value_en' => 'https://maps.google.com/?q=123+Main+Street', 'value_ar' => 'https://maps.google.com/?q=123+Main+Street', 'type' => 'text'],
            
            // Opening Hours
            ['key' => 'opening_hours_en', 'value_en' => 'Monday - Friday: 11:00 AM - 10:00 PM\nSaturday - Sunday: 10:00 AM - 11:00 PM', 'value_ar' => 'الاثنين - الجمعة: 11:00 صباحاً - 10:00 مساءً\nالسبت - الأحد: 10:00 صباحاً - 11:00 مساءً', 'type' => 'textarea'],
            ['key' => 'opening_hours_ar', 'value_en' => 'Monday - Friday: 11:00 AM - 10:00 PM\nSaturday - Sunday: 10:00 AM - 11:00 PM', 'value_ar' => 'الاثنين - الجمعة: 11:00 صباحاً - 10:00 مساءً\nالسبت - الأحد: 10:00 صباحاً - 11:00 مساءً', 'type' => 'textarea'],
            
            // Social Media
            ['key' => 'facebook_url', 'value_en' => 'https://facebook.com/deliciousrestaurant', 'value_ar' => 'https://facebook.com/deliciousrestaurant', 'type' => 'text'],
            ['key' => 'instagram_url', 'value_en' => 'https://instagram.com/deliciousrestaurant', 'value_ar' => 'https://instagram.com/deliciousrestaurant', 'type' => 'text'],
            ['key' => 'twitter_url', 'value_en' => 'https://twitter.com/deliciousrestaurant', 'value_ar' => 'https://twitter.com/deliciousrestaurant', 'type' => 'text'],
            ['key' => 'youtube_url', 'value_en' => 'https://youtube.com/deliciousrestaurant', 'value_ar' => 'https://youtube.com/deliciousrestaurant', 'type' => 'text'],
            
            // Images (placeholder URLs)
            ['key' => 'logo', 'value_en' => '/images/logo.png', 'value_ar' => '/images/logo.png', 'type' => 'image'],
            ['key' => 'hero_image', 'value_en' => '/images/hero.jpg', 'value_ar' => '/images/hero.jpg', 'type' => 'image'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value_en' => $setting['value_en'],
                    'value_ar' => $setting['value_ar'],
                    'type' => $setting['type']
                ]
            );
        }
    }
}
