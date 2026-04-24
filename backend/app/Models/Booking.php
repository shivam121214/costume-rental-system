<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'customer_name',
        'phone',
        'product_id',
        'variant',
        'quantity',
        'start_date',
        'end_date',
        'pickup_deadline',
        'status',
        'payment_status',
        'total_amount',
        'advance_payment',
        'security_deposit'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}