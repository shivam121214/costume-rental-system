<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Booking;

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
            'quantity' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        $product = Product::findOrFail($data['product_id']);

        $stock = $product->variants[$data['variant']] ?? 0;

        $booked = Booking::where('product_id', $data['product_id'])
            ->where('variant', $data['variant'])
            ->whereIn('status', ['reserved', 'picked', 'late'])
            ->whereDate('start_date', '<=', $data['end_date'])
            ->whereDate('end_date', '>=', $data['start_date'])
            ->sum('quantity');

        $available = $stock - $booked;

        if ($data['quantity'] > $available) {
            return response()->json([
                'message' => 'Requested quantity not available'
            ], 422);
        }

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

        $product = Product::findOrFail($requestItem->product_id);

        $stock = $product->variants[$requestItem->variant] ?? 0;

        $booked = Booking::where('product_id', $requestItem->product_id)
            ->where('variant', $requestItem->variant)
            ->whereIn('status', ['reserved', 'picked', 'late'])
            ->whereDate('start_date', '<=', $requestItem->end_date)
            ->whereDate('end_date', '>=', $requestItem->start_date)
            ->sum('quantity');

        $available = $stock - $booked;

        if ($requestItem->quantity > $available) {
            return response()->json([
                'message' => 'Cannot accept. Stock not available.'
            ], 422);
        }

        $requestItem->update([
            'status' => 'accepted'
        ]);

        $booking = Booking::create([
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
