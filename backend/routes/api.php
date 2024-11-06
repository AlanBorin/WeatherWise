<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WeatherHistoryController;
use App\Http\Controllers\SavedQueryController;

Route::middleware([])->post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/weather-history', [WeatherHistoryController::class, 'store']);

Route::get('/weather-history/{user_id}', [WeatherHistoryController::class, 'index']);

Route::post('/saved-queries', [SavedQueryController::class, 'store']);

Route::get('/saved-queries/{user_id}', [SavedQueryController::class, 'index']);
