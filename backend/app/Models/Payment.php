<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'amount',
        'type',
        'method'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}