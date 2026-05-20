<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Booking;
use App\Models\BookingRequest;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_products' => Product::where('status', 'available')->count(),
            'pending_requests' => BookingRequest::where('status', 'pending')->count(),
            'total_bookings' => Booking::count(),
            'active_rentals' => Booking::whereIn('status', ['reserved', 'picked', 'late'])->count(),
            'late_returns' => Booking::where('status', '!=', 'returned')
                ->whereDate('end_date', '<', now())
                ->count(),
            'todays_pickups' => Booking::whereDate('start_date', now())
                ->where('status', '!=', 'picked')
                ->count(),
            'todays_returns' => Booking::whereDate('end_date', now())
                ->whereIn('status', ['reserved', 'picked', 'late'])
                ->count(),

            'total_revenue' => Booking::sum('total_amount'),
            'paid_amount' => Booking::where('payment_status', 'paid')->sum('total_amount'),
            'pending_amount' => Booking::where('payment_status', 'pending')->sum('total_amount'),
            'partial_count' => Booking::where('payment_status', 'partial')->count(),
        ]);
    }
}
