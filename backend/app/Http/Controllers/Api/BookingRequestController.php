<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Illuminate\Http\Request;

class BookingRequestController extends Controller
{
    public function index()
    {
        return response()->json(
            BookingRequest::with('product')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required',
            'phone' => 'required',
            'product_id' => 'required',
            'variant' => 'required',
            'quantity' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        $booking = BookingRequest::create($data);

        return response()->json($booking, 201);
    }

    public function reject(Request $request, $id)
    {
        $item = BookingRequest::findOrFail($id);

        $item->update([
            'status' => 'rejected',
            'reject_reason' => $request->reject_reason
        ]);

        return response()->json(['message' => 'Rejected']);
    }

    public function accept($id)
    {
        $requestItem = BookingRequest::findOrFail($id);

        $requestItem->update([
            'status' => 'accepted'
        ]);

        $booking = \App\Models\Booking::create([
            'customer_name' => $requestItem->customer_name,
            'phone' => $requestItem->phone,
            'product_id' => $requestItem->product_id,
            'variant' => $requestItem->variant,
            'quantity' => $requestItem->quantity,
            'start_date' => $requestItem->start_date,
            'end_date' => $requestItem->end_date,
            'pickup_deadline' => now()->addDay(),
            'status' => 'reserved',
            'payment_status' => 'pending',
            'total_amount' => 0,
            'advance_payment' => 0,
            'security_deposit' => 0
        ]);

        return response()->json($booking);
    }
}
