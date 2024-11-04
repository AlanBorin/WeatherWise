<?php

namespace App\Http\Controllers;

use App\Models\WeatherHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WeatherHistoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'city' => 'required|string',
            'temperature' => 'required|numeric',
            'description' => 'required|string',
            'wind_speed' => 'required|numeric',
            'date' => 'required|date',
        ]);
    
        WeatherHistory::create([
            'user_id' => $request->user_id,
            'city' => $request->city,
            'temperature' => $request->temperature,
            'description' => $request->description,
            'wind_speed' => $request->wind_speed,
            'date' => $request->date,
        ]);
    
        return response()->json(['message' => 'Weather data saved successfully']);
    }
    

    public function index($user_id)
    {
        $history = WeatherHistory::where('user_id', $user_id)->get();

        if ($history->isEmpty()) {
            return response()->json(['message' => 'Nenhum histórico encontrado para este usuário.'], 404);
        }

        return response()->json($history);
    }
}
