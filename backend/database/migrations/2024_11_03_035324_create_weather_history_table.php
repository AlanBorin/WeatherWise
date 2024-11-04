<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWeatherHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('weather_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('city');
            $table->float('temperature');
            $table->string('description');
            $table->float('wind_speed');
            $table->timestamp('date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('weather_history');
    }
}
