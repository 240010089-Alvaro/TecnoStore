<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable();
            $table->json('ajustes')->nullable();
        });

        Schema::table('proveedores', function (Blueprint $table) {
            $table->string('avatar')->nullable();
            $table->json('ajustes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'ajustes']);
        });

        Schema::table('proveedores', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'ajustes']);
        });
    }
};
