<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'theme',
        'description',
        'image',
        'gallery',
        'rent_price',
        'security_deposit',
        'total_quantity',
        'variants',
        'sizes',
        'status',
        'is_featured',
        'show_on_featured_section'
    ];

    protected $casts = [
        'variants' => 'array',
        'gallery' => 'array',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function requests()
    {
        return $this->hasMany(BookingRequest::class);
    }
}
