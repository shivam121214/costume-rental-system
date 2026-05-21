<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(
            Booking::with('product')->latest()->get()
        );
    }

    public function updateStatus(Request $request, int $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update([
            'status' => $request->status
        ]);

        return response()->json($booking);
    }

    public function markReturn(int $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update([
            'status' => 'returned'
        ]);

        return response()->json(['message' => 'Returned']);
    }

    public function markPickup(int $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update([
            'status' => 'picked'
        ]);

        return response()->json(['message' => 'Marked as picked']);
    }

    public function directOrder(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required',
            'phone' => 'required',
            'product_id' => 'required|exists:products,id',
            'variant' => 'required',
            'quantity' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $product = \App\Models\Product::findOrFail($data['product_id']);

        $rent = $product->rent_price * $data['quantity'];
        $deposit = $product->security_deposit;
        $total = $rent + $deposit;

        $booking = \App\Models\Booking::create([
            ...$data,
            'pickup_deadline' => now(),
            'status' => 'picked',
            'payment_status' => 'paid',
            'total_amount' => $rent,
            'advance_payment' => $total,
            'security_deposit' => $deposit,
        ]);

        return response()->json($booking, 201);
    }

    public function todaysPickups()
    {
        $bookings = Booking::with('product')
            ->whereDate('start_date', now())
            ->where('status', '!=', 'picked')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function todaysReturns()
    {
        $bookings = Booking::with('product')
            ->whereDate('end_date', now())
            ->whereIn('status', ['reserved', 'picked', 'late'])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function activeRentals()
    {
        $bookings = Booking::with('product')
            ->where(function ($q) {
                $q->whereIn('status', ['reserved', 'picked'])
                    ->orWhere(function ($q2) {
                        $q2->where('status', '!=', 'returned')
                            ->whereDate('end_date', '<', now());
                    });
            })
            ->latest()
            ->get();

        return response()->json($bookings);
    }
    public function lateReturns()
    {
        $bookings = Booking::with('product')
            ->where('status', '!=', 'returned')
            ->whereDate('end_date', '<', now())
            ->latest()
            ->get();

        return response()->json($bookings);
    }
}
