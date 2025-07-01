<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MenuItem::available()->ordered();
        
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }
        
        $menuItems = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $menuItems
        ]);
    }

    /**
     * Display all menu items for admin panel (including unavailable ones).
     */
    public function admin()
    {
        $menuItems = MenuItem::ordered()->get();
        
        return response()->json([
            'success' => true,
            'data' => $menuItems
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'nullable|in:true,false,1,0,on,off',
            'sort_order' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // Convert string boolean values to actual booleans
        if (isset($data['is_available'])) {
            $data['is_available'] = filter_var($data['is_available'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($data['is_available'] === null) {
                $data['is_available'] = false; // Default to false if invalid value
            }
        } else {
            $data['is_available'] = true; // Default to true if not provided
        }
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menu-items', 'public');
            $data['image'] = $imagePath;
        }

        $menuItem = MenuItem::create($data);

        return response()->json([
            'success' => true,
            'data' => $menuItem,
            'message' => 'Menu item created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menuItem = MenuItem::find($id);
        
        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $menuItem
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $menuItem = MenuItem::find($id);
        
        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_en' => 'sometimes|required|string|max:255',
            'name_ar' => 'sometimes|required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'sometimes|required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'nullable|in:true,false,1,0,on,off',
            'sort_order' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // Convert string boolean values to actual booleans
        if (isset($data['is_available'])) {
            $data['is_available'] = filter_var($data['is_available'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($data['is_available'] === null) {
                $data['is_available'] = false; // Default to false if invalid value
            }
        }
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($menuItem->image) {
                Storage::disk('public')->delete($menuItem->image);
            }
            
            $imagePath = $request->file('image')->store('menu-items', 'public');
            $data['image'] = $imagePath;
        }

        $menuItem->update($data);

        return response()->json([
            'success' => true,
            'data' => $menuItem,
            'message' => 'Menu item updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menuItem = MenuItem::find($id);
        
        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found'
            ], 404);
        }

        // Delete image if exists
        if ($menuItem->image) {
            Storage::disk('public')->delete($menuItem->image);
        }

        $menuItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully'
        ]);
    }

    /**
     * Get menu categories
     */
    public function categories()
    {
        $categories = MenuItem::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get all menu data (items and categories) in a single request
     */
    public function all()
    {
        $menuItems = MenuItem::available()->ordered()->get();
        $categories = MenuItem::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $menuItems,
                'categories' => $categories
            ]
        ]);
    }
}
