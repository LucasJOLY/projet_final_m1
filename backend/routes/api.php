<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AccountAuthController;

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
        'message' => 'API Laravel fonctionne correctement!'
    ]);
});

// Authentification pour Account
Route::post('account/register', [AccountAuthController::class, 'register']);
Route::post('account/login', [AccountAuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('account/logout', [AccountAuthController::class, 'logout']);
    Route::get('account/user', [AccountAuthController::class, 'user']);

    // Routes RESTful protégées
    Route::apiResource('accounts', App\Http\Controllers\AccountController::class);
    Route::apiResource('clients', App\Http\Controllers\ClientController::class);
    Route::apiResource('projects', App\Http\Controllers\ProjectController::class);
    Route::apiResource('invoices', App\Http\Controllers\InvoiceController::class);
    Route::apiResource('invoice-items', App\Http\Controllers\InvoiceItemController::class);
});
