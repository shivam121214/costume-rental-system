<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Booking;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function check(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required',
            'variant' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        $product = Product::findOrFail($data['product_id']);

        $variants = $product->variants ?? [];

        $totalStock = isset($variants[$data['variant']])
            ? (int) $variants[$data['variant']]
            : 0;

        $bookedQty = Booking::where('product_id', $data['product_id'])
            ->where('variant', $data['variant'])
            ->whereIn('status', ['reserved', 'picked', 'late'])
            ->whereDate('start_date', '<=', $data['end_date'])
            ->whereDate('end_date', '>=', $data['start_date'])
            ->sum('quantity');

        $available = $totalStock - $bookedQty;

        return response()->json([
            'variant' => $data['variant'],
            'total_quantity' => $totalStock,
            'booked_quantity' => $bookedQty,
            'available_quantity' => max(0, $available)
        ]);
    }
}