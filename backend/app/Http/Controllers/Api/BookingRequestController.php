<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Booking;
use App\Services\WhatsApp\WhatsAppMessageService;

class BookingRequestController extends Controller
{
    public function index()
    {
        $query = BookingRequest::with('product')->latest();

        if (request()->has('status') && request('status') !== 'all') {
            $query->where('status', request('status'));
        }

        $requests = $query->paginate(10);

        foreach ($requests->items() as $item) {
            if (!$item->product) {
                $item->available_quantity = 0;
                continue;
            }

            // $stock = $item->product->variants[$item->variant] ?? 0;
            $variants = $item->product->variants ?? [];
            $stock = $variants[$item->variant] ?? 0;

            $booked = Booking::where('product_id', $item->product_id)
                ->where('variant', $item->variant)
                ->whereIn('status', ['reserved', 'picked', 'late'])
                ->whereDate('start_date', '<=', $item->end_date)
                ->whereDate('end_date', '>=', $item->start_date)
                ->sum('quantity');

            $item->available_quantity = $stock - $booked;
        }

        $nextPage = $requests->nextPageUrl();

        if ($nextPage) {
            // add status param again
            $status = request('status');

            if ($status && $status !== 'all') {
                $nextPage .= '&status=' . $status;
            }

            // fix https
            $nextPage = str_replace('http://', 'https://', $nextPage);
        }

        if ($nextPage) {
            $nextPage = str_replace('http://', 'https://', $nextPage);
        }

        return response()->json([
            'data' => $requests->items(),
            'next_page_url' => $nextPage
        ]);
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

        // $stock = $product->variants[$data['variant']] ?? 0;
        $variants = $product->variants ?? [];
        $stock = $variants[$data['variant']] ?? 0;

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

        // Generate WhatsApp message and deep-link
        $adminPhoneNumber = config('services.whatsapp.admin_phone');
        
        $messageText = WhatsAppMessageService::generateRequestSubmissionMessage(
            [
                'name' => $data['customer_name'],
                'phone' => $data['phone'],
            ],
            [WhatsAppMessageService::extractBookingData($booking)]
        );

        $whatsappLink = WhatsAppMessageService::generateWhatsAppLink(
            $adminPhoneNumber,
            $messageText
        );

        return response()->json([
            'booking_request' => $booking,
            'whatsapp_link' => $whatsappLink,
            'whatsapp_message' => $messageText,
        ], 201);
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

        // $stock = $product->variants[$requestItem->variant] ?? 0;
        $variants = $product->variants ?? [];
        $stock = $variants[$requestItem->variant] ?? 0;

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
