<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedQuery extends Model
{
    use HasFactory;

    protected $table = 'saved_queries';

    protected $fillable = ['user_id', 'city', 'temperature', 'description', 'wind_speed', 'date'];
}
