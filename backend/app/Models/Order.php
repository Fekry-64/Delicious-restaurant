<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_address',
        'payment_method',
        'payment_status',
        'order_status',
        'subtotal',
        'tax',
        'delivery_fee',
        'total',
        'special_instructions',
        'estimated_delivery_time'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'estimated_delivery_time' => 'datetime'
    ];

    /**
     * Get the order items for this order.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));
        
        return "{$prefix}-{$date}-{$random}";
    }

    /**
     * Boot method to auto-generate order number.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }

    /**
     * Calculate order totals.
     */
    public function calculateTotals(): void
    {
        $subtotal = $this->orderItems->sum('total_price');
        $tax = $subtotal * 0.05; // 5% tax
        $deliveryFee = $subtotal > 50 ? 0 : 5; // Free delivery over $50
        $total = $subtotal + $tax + $deliveryFee;

        $this->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'delivery_fee' => $deliveryFee,
            'total' => $total
        ]);
    }

    /**
     * Get order status badge class.
     */
    public function getStatusBadgeClass(): string
    {
        return match($this->order_status) {
            'pending' => 'badge bg-warning',
            'confirmed' => 'badge bg-info',
            'preparing' => 'badge bg-primary',
            'ready' => 'badge bg-success',
            'delivered' => 'badge bg-secondary',
            'cancelled' => 'badge bg-danger',
            default => 'badge bg-secondary'
        };
    }

    /**
     * Get payment status badge class.
     */
    public function getPaymentStatusBadgeClass(): string
    {
        return match($this->payment_status) {
            'pending' => 'badge bg-warning',
            'paid' => 'badge bg-success',
            'failed' => 'badge bg-danger',
            default => 'badge bg-secondary'
        };
    }
}
