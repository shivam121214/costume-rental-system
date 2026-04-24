<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    protected $fillable = [
        'customer_name',
        'phone',
        'product_id',
        'variant',
        'quantity',
        'start_date',
        'end_date',
        'status',
        'reject_reason'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}