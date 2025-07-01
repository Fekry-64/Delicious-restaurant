<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'item_name_en',
        'item_name_ar',
        'item_description_en',
        'item_description_ar',
        'unit_price',
        'quantity',
        'total_price',
        'category'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2'
    ];

    /**
     * Get the order that owns this order item.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the menu item that this order item references.
     */
    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    /**
     * Calculate total price for this item.
     */
    public function calculateTotalPrice(): void
    {
        $this->total_price = $this->unit_price * $this->quantity;
    }

    /**
     * Boot method to auto-calculate total price.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            $orderItem->calculateTotalPrice();
        });

        static::updating(function ($orderItem) {
            $orderItem->calculateTotalPrice();
        });
    }
}
