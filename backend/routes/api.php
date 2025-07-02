<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AccountAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Middleware\Localization;

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



// Route de test pour vérifier que l'API fonctionne
Route::get('/test', function () {
    return response()->json([
        'message' => __('messages.api.test')
    ]);
});

// Authentification pour Account
Route::post('account/register', [AccountAuthController::class, 'register']);
Route::post('account/login', [AccountAuthController::class, 'login']);
Route::post('account/refresh', [AccountAuthController::class, 'refresh']);
Route::get('account/check-email', [AccountAuthController::class, 'checkEmail']);

Route::middleware('auth:api')->group(function () {
    Route::post('account/logout', [AccountAuthController::class, 'logout']);
    Route::get('account/user', [AccountAuthController::class, 'user']);

    // Routes RESTful protégées
    Route::apiResource('accounts', App\Http\Controllers\AccountController::class);
    Route::apiResource('clients', App\Http\Controllers\ClientController::class);
    Route::apiResource('projects', App\Http\Controllers\ProjectController::class);
    Route::apiResource('quotes', App\Http\Controllers\QuoteController::class);
    Route::get('quotes-next-number', [App\Http\Controllers\QuoteController::class, 'getNextNumber']);
    Route::apiResource('quote-lines', App\Http\Controllers\QuoteLineController::class);
    Route::apiResource('invoices', App\Http\Controllers\InvoiceController::class);
    Route::get('invoices-next-number', [App\Http\Controllers\InvoiceController::class, 'getNextNumber']);
    Route::apiResource('invoice-lines', App\Http\Controllers\InvoiceLineController::class);

    // Routes Dashboard
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index']);
    Route::get('dashboard/quarter', [App\Http\Controllers\DashboardController::class, 'getQuarterData']);
    Route::get('dashboard/charts', [App\Http\Controllers\DashboardController::class, 'getChartsData']);
});

// Routes de réinitialisation de mot de passe
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::get('/verify-reset-token/{token}', [PasswordResetController::class, 'verifyResetToken']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
