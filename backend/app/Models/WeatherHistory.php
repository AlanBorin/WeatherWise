<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherHistory extends Model
{
    use HasFactory;
    
    protected $table = 'weather_history';

    protected $fillable = ['user_id', 'city', 'temperature', 'description', 'wind_speed', 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
