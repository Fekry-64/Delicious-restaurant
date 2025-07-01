<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API routes
Route::prefix('v1')->group(function () {
    // Site information
    Route::get('/site/all', [SiteController::class, 'all']);
    Route::get('/site/info', [SiteController::class, 'info']);
    Route::get('/site/contact', [SiteController::class, 'contact']);
    Route::get('/site/social', [SiteController::class, 'social']);
    Route::get('/site/settings', [SiteController::class, 'settings']);

    // Menu (public read, admin write)
    Route::get('/menu', [MenuController::class, 'index']);
    Route::get('/menu/all', [MenuController::class, 'all']);
    Route::get('/menu/categories', [MenuController::class, 'categories']);
    Route::get('/menu/{id}', [MenuController::class, 'show']);
    Route::get('/menu/admin/all', [MenuController::class, 'admin']);
    
    // Menu management (temporarily public for admin panel)
    Route::post('/menu', [MenuController::class, 'store']);
    Route::put('/menu/{id}', [MenuController::class, 'update']);
    Route::delete('/menu/{id}', [MenuController::class, 'destroy']);

    // Reservations (public)
    Route::post('/reservations', [ReservationController::class, 'store']);

    // Orders (public)
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/number/{orderNumber}', [OrderController::class, 'getByOrderNumber']);
    Route::get('/orders/customer/{email}', [OrderController::class, 'getByCustomerEmail']);

    // TEMPORARY: Public route for admin orders (for testing, remove in production)
    Route::get('/all-orders', [OrderController::class, 'index']);

    // TEMPORARY: Public route for updating order status (for testing, remove in production)
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // TEMPORARY: Public route for admin reservations (for testing, remove in production)
    Route::get('/all-reservations', [ReservationController::class, 'index']);

    // TEMPORARY: Public route for updating reservation status (for testing, remove in production)
    Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

    // TEMPORARY: Public route for updating reservation details (for testing, remove in production)
    Route::patch('/reservations/{id}', [ReservationController::class, 'update']);

    // Admin routes (protected)
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        // Reservation management
        Route::apiResource('reservations', ReservationController::class);
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
        Route::get('/reservations/today', [ReservationController::class, 'today']);
        Route::get('/reservations/upcoming', [ReservationController::class, 'upcoming']);

        // Order management
        Route::apiResource('orders', OrderController::class);
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });
}); 