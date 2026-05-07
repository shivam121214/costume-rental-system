<?php

namespace App\Services\WhatsApp;

use DateTime;

class WhatsAppMessageService
{
    /**
     * Generate WhatsApp message for request submission
     * 
     * @param array $customerData ['name' => 'John', 'phone' => '919876543210']
     * @param array $cartItems [['product_name' => 'Superhero', 'variant' => 'M', ...]]
     * @return string Formatted WhatsApp message
     */
    public static function generateRequestSubmissionMessage(
        array $customerData,
        array $cartItems = []
    ): string {
        $message = "Hello, I just placed a costume rental request.\n\n";
        $message .= "📋 *Customer Details*\n";
        $message .= "Name: {$customerData['name']}\n";
        $message .= "Phone: {$customerData['phone']}\n\n";
        
        if (count($cartItems) === 1) {
            $item = $cartItems[0];
            $message .= "👗 *Costume Details*\n";
            $message .= "Product: {$item['product_name']}\n";
            $message .= "Size/Variant: {$item['variant']}\n";
            $message .= "Quantity: {$item['quantity']}\n";
            $message .= "Rental Dates: {$item['start_date']} to {$item['end_date']}\n";
        } else {
            $message .= "👗 *Costume Items (" . count($cartItems) . ")*\n";
            foreach ($cartItems as $item) {
                $message .= "• {$item['product_name']} ({$item['variant']}) x{$item['quantity']}\n";
            }
            if (!empty($cartItems)) {
                $message .= "\nRental Dates: {$cartItems[0]['start_date']} to {$cartItems[0]['end_date']}\n";
            }
        }
        
        $message .= "\nPlease confirm receipt of this request.";
        
        return $message;
    }

    /**
     * Generate WhatsApp deep-link (wa.me URL)
     * 
     * @param string $adminPhoneNumber Format: '919876543210' (no + or spaces)
     * @param string $message Message text to send
     * @return string WhatsApp URL
     */
    public static function generateWhatsAppLink(
        string $adminPhoneNumber,
        string $message
    ): string {
        $encodedMessage = urlencode($message);
        return "https://wa.me/{$adminPhoneNumber}?text={$encodedMessage}";
    }

    /**
     * Generate request accepted message
     */
    public static function generateRequestAcceptedMessage(
        $booking,
        string $pickupDeadline = null
    ): string {
        $message = "✅ *Your Rental Request Accepted!*\n\n";
        $message .= "Hi {$booking->customer_name},\n\n";
        $message .= "Great news! Your costume rental request has been accepted.\n\n";
        $message .= "📋 *Booking Details*\n";
        $message .= "Product: {$booking->product->name}\n";
        $message .= "Variant: {$booking->variant}\n";
        $message .= "Quantity: {$booking->quantity}\n";
        $message .= "Pickup Date: " . self::formatDate($booking->start_date) . "\n";
        $message .= "Return Date: " . self::formatDate($booking->end_date) . "\n";
        
        if ($pickupDeadline) {
            $message .= "\n⏰ *Important*\n";
            $message .= "Please pick up by: {$pickupDeadline}\n";
        }
        
        $message .= "\nPlease reply to confirm availability.";
        
        return $message;
    }

    /**
     * Generate request rejected message
     */
    public static function generateRequestRejectedMessage(
        $bookingRequest,
        string $reason = null
    ): string {
        $message = "❌ *Costume Request - Unavailable*\n\n";
        $message .= "Hi {$bookingRequest->customer_name},\n\n";
        $message .= "Unfortunately, your requested costume is unavailable for your selected dates.\n\n";
        
        if ($reason) {
            $message .= "Reason: {$reason}\n\n";
        }
        
        $message .= "Please contact us to explore other options.\n";
        $message .= "We have other great costumes available!";
        
        return $message;
    }

    /**
     * Generate pickup confirmation message
     */
    public static function generatePickupConfirmedMessage($booking): string
    {
        $message = "🎉 *Pickup Confirmed!*\n\n";
        $message .= "Hi {$booking->customer_name},\n\n";
        $message .= "Your costume has been picked up successfully.\n\n";
        $message .= "📍 *Important - Return Information*\n";
        $message .= "Please return by: " . self::formatDateTime($booking->end_date) . "\n";
        $message .= "Late charges will apply if not returned on time.\n\n";
        $message .= "Enjoy your costume! 👗";
        
        return $message;
    }

    /**
     * Generate return completed message
     */
    public static function generateReturnCompletedMessage(
        $booking,
        string $googleReviewLink = null
    ): string {
        $message = "✨ *Thank You for Renting with Us!*\n\n";
        $message .= "Hi {$booking->customer_name},\n\n";
        $message .= "Your costume has been returned and checked in successfully.\n\n";
        $message .= "We hope you enjoyed wearing it!\n\n";
        
        if ($googleReviewLink) {
            $message .= "⭐ *Help Us Improve*\n";
            $message .= "Please share your experience: {$googleReviewLink}\n\n";
        }
        
        $message .= "See you next time! 👋";
        
        return $message;
    }

    /**
     * Extract and format booking data for message generation
     */
    public static function extractBookingData($booking): array
    {
        return [
            'customer_name' => $booking->customer_name,
            'phone' => $booking->phone,
            'product_name' => $booking->product->name ?? 'Unknown Product',
            'variant' => $booking->variant,
            'quantity' => $booking->quantity,
            'start_date' => self::formatDate($booking->start_date),
            'end_date' => self::formatDate($booking->end_date),
        ];
    }

    /**
     * Format date for message display
     */
    private static function formatDate($date): string
    {
        if (is_string($date)) {
            $date = new DateTime($date);
        }
        return $date->format('M d, Y');
    }

    /**
     * Format date and time for message display
     */
    private static function formatDateTime($date): string
    {
        if (is_string($date)) {
            $date = new DateTime($date);
        }
        return $date->format('M d, Y h:i A');
    }
}
