<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuItems = [
            // Appetizers
            [
                'name_en' => 'Bruschetta',
                'name_ar' => 'بروشيتا',
                'description_en' => 'Toasted bread topped with tomatoes, garlic, and fresh basil',
                'description_ar' => 'خبز محمص مع الطماطم والثوم والريحان الطازج',
                'price' => 8.99,
                'category' => 'appetizers',
                'sort_order' => 1
            ],
            [
                'name_en' => 'Caesar Salad',
                'name_ar' => 'سلطة قيصر',
                'description_en' => 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
                'description_ar' => 'خس روماني طازج مع صلصة قيصر وكرتون وجبن بارميزان',
                'price' => 12.99,
                'category' => 'appetizers',
                'sort_order' => 2
            ],
            [
                'name_en' => 'Soup of the Day',
                'name_ar' => 'حساء اليوم',
                'description_en' => 'Chef\'s daily special soup made with fresh seasonal ingredients',
                'description_ar' => 'حساء خاص من الشيف مصنوع من مكونات موسمية طازجة',
                'price' => 9.99,
                'category' => 'appetizers',
                'sort_order' => 3
            ],

            // Main Courses
            [
                'name_en' => 'Grilled Salmon',
                'name_ar' => 'سلمون مشوي',
                'description_en' => 'Fresh Atlantic salmon grilled to perfection with seasonal vegetables',
                'description_ar' => 'سلمون أطلسي طازج مشوي إلى الكمال مع خضروات موسمية',
                'price' => 28.99,
                'category' => 'main',
                'sort_order' => 4
            ],
            [
                'name_en' => 'Beef Tenderloin',
                'name_ar' => 'فيليه لحم البقر',
                'description_en' => 'Premium beef tenderloin with red wine reduction and mashed potatoes',
                'description_ar' => 'فيليه لحم بقر فاخر مع صلصة النبيذ الأحمر وبطاطس مهروسة',
                'price' => 34.99,
                'category' => 'main',
                'sort_order' => 5
            ],
            [
                'name_en' => 'Chicken Marsala',
                'name_ar' => 'دجاج مارسالا',
                'description_en' => 'Pan-seared chicken breast in Marsala wine sauce with mushrooms',
                'description_ar' => 'صدر دجاج مقلي في صلصة نبيذ مارسالا مع الفطر',
                'price' => 24.99,
                'category' => 'main',
                'sort_order' => 6
            ],
            [
                'name_en' => 'Vegetarian Pasta',
                'name_ar' => 'باستا نباتية',
                'description_en' => 'Fresh pasta with seasonal vegetables in light cream sauce',
                'description_ar' => 'باستا طازجة مع خضروات موسمية في صلصة كريمة خفيفة',
                'price' => 18.99,
                'category' => 'main',
                'sort_order' => 7
            ],

            // Desserts
            [
                'name_en' => 'Tiramisu',
                'name_ar' => 'تيراميسو',
                'description_en' => 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
                'description_ar' => 'حلوى إيطالية كلاسيكية مع بسكويت ليدي فينجر مغموس في القهوة وكريمة ماسكاربون',
                'price' => 12.99,
                'category' => 'desserts',
                'sort_order' => 8
            ],
            [
                'name_en' => 'Chocolate Lava Cake',
                'name_ar' => 'كيك الشوكولاتة اللافا',
                'description_en' => 'Warm chocolate cake with molten center, served with vanilla ice cream',
                'description_ar' => 'كيك شوكولاتة دافئ مع مركز ذائب، يقدم مع آيس كريم الفانيليا',
                'price' => 11.99,
                'category' => 'desserts',
                'sort_order' => 9
            ],
            [
                'name_en' => 'New York Cheesecake',
                'name_ar' => 'تشيز كيك نيويورك',
                'description_en' => 'Creamy New York style cheesecake with berry compote',
                'description_ar' => 'تشيز كيك نيويورك كريمي مع كومبوت التوت',
                'price' => 10.99,
                'category' => 'desserts',
                'sort_order' => 10
            ],

            // Beverages
            [
                'name_en' => 'Fresh Lemonade',
                'name_ar' => 'ليمونادة طازجة',
                'description_en' => 'Homemade lemonade with fresh lemons and mint',
                'description_ar' => 'ليمونادة منزلية مع ليمون طازج ونعناع',
                'price' => 4.99,
                'category' => 'beverages',
                'sort_order' => 11
            ],
            [
                'name_en' => 'Iced Tea',
                'name_ar' => 'شاي مثلج',
                'description_en' => 'Refreshing iced tea with lemon and honey',
                'description_ar' => 'شاي مثلج منعش مع ليمون وعسل',
                'price' => 3.99,
                'category' => 'beverages',
                'sort_order' => 12
            ],
            [
                'name_en' => 'Espresso',
                'name_ar' => 'إسبريسو',
                'description_en' => 'Rich Italian espresso made from premium coffee beans',
                'description_ar' => 'إسبريسو إيطالي غني مصنوع من حبوب قهوة فاخرة',
                'price' => 3.50,
                'category' => 'beverages',
                'sort_order' => 13
            ]
        ];

        foreach ($menuItems as $item) {
            MenuItem::updateOrCreate(
                ['name_en' => $item['name_en']],
                $item
            );
        }
    }
}
