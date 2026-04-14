<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-proveedor', [AuthController::class, 'registerProveedor']);
Route::post('/login-proveedor', [AuthController::class, 'loginProveedor']);

// ── NUEVA: proveedor por ID (para mostrar info en tarjetas) ──
Route::get('/proveedores/{id}', [AuthController::class, 'showProveedor']);

// Productos
Route::get('/productos', [ProductoController::class, 'index']);
Route::post('/productos', [ProductoController::class, 'store']);
Route::get('/productos/proveedor/{proveedor_id}', [ProductoController::class, 'byProveedor']);
Route::post('/productos/{id}', [ProductoController::class, 'update']);
Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);