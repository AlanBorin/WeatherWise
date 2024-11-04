<?php

namespace App\Http\Controllers;

use App\Models\SavedQuery;
use Illuminate\Http\Request;

class SavedQueryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'city' => 'required|string',
            'temperature' => 'required|numeric',
            'description' => 'required|string',
            'wind_speed' => 'required|numeric',
            'date' => 'required|date',
        ]);

        $savedQuery = SavedQuery::create($request->all());

        return response()->json(['message' => 'Consulta salva com sucesso!', 'data' => $savedQuery], 201);
    }

    public function index($user_id)
    {
        $savedQueries = SavedQuery::where('user_id', $user_id)->get();

        if ($savedQueries->isEmpty()) {
            return response()->json(['message' => 'Nenhuma consulta salva encontrada para este usuário.'], 404);
        }

        return response()->json($savedQueries);
    }
}
