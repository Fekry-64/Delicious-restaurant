<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string',
            'payment_method' => 'required|in:card,cod',
            'special_instructions' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create the order
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'delivery_address' => $request->delivery_address,
                'payment_method' => $request->payment_method,
                'special_instructions' => $request->special_instructions,
                'subtotal' => 0,
                'tax' => 0,
                'delivery_fee' => 0,
                'total' => 0,
            ]);

            // Create order items
            foreach ($request->items as $item) {
                $menuItem = MenuItem::find($item['id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'item_name_en' => $menuItem->name_en,
                    'item_name_ar' => $menuItem->name_ar,
                    'item_description_en' => $menuItem->description_en,
                    'item_description_ar' => $menuItem->description_ar,
                    'unit_price' => $menuItem->price,
                    'quantity' => $item['quantity'],
                    'category' => $menuItem->category,
                ]);
            }

            // Calculate totals
            $order->calculateTotals();

            // Set payment status based on payment method
            if ($request->payment_method === 'card') {
                $order->update(['payment_status' => 'paid']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load('orderItems'),
                'message' => 'Order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(string $id)
    {
        $order = Order::with('orderItems')->find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Get order by order number.
     */
    public function getByOrderNumber(string $orderNumber)
    {
        $order = Order::with('orderItems')->where('order_number', $orderNumber)->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'order_status' => 'required|in:pending,confirmed,preparing,ready,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->update($request->only(['order_status', 'payment_status']));

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order status updated successfully'
        ]);
    }

    /**
     * Get all orders (for admin).
     */
    public function index()
    {
        $orders = Order::with('orderItems')
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get orders by customer email.
     */
    public function getByCustomerEmail(string $email)
    {
        $orders = Order::with('orderItems')
            ->where('customer_email', $email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}
