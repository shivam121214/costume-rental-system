<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'whatsapp' => [
        'admin_phone' => env('WHATSAPP_ADMIN_PHONE', '919876543210'),
        'business_name' => env('WHATSAPP_BUSINESS_NAME', 'Costume Rental'),
        'pickup_deadline' => env('WHATSAPP_PICKUP_DEADLINE', 'Within 24 hours'),
        'google_review_link' => env('WHATSAPP_GOOGLE_REVIEW_LINK', ''),
        
        // Future: API credentials for WhatsApp Business API
        // 'api_url' => env('WHATSAPP_API_URL'),
        // 'api_token' => env('WHATSAPP_API_TOKEN'),
        // 'business_phone_number_id' => env('WHATSAPP_BUSINESS_PHONE_ID'),
    ],

];
