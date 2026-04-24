<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\BookingRequestController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


Route::get('/requests', [BookingRequestController::class, 'index']);
Route::post('/requests', [BookingRequestController::class, 'store']);
Route::post('/requests/{id}/reject', [BookingRequestController::class, 'reject']);
Route::post('/requests/{id}/accept', [BookingRequestController::class, 'accept']);


Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
Route::post('/bookings/{id}/return', [BookingController::class, 'markReturn']);
Route::post('/direct-order', [BookingController::class, 'directOrder']);

Route::post('/check-availability', [AvailabilityController::class, 'check']);


Route::get('/dashboard', [DashboardController::class, 'stats']);


Route::post('/admin/login', [AuthController::class, 'login']);