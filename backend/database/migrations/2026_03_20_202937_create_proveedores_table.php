<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // nombre del proveedor
            $table->string('email')->unique();  // email para login
            $table->string('password');   // password para login
            $table->string('empresa');    // nombre de la empresa
            $table->string('telefono');   // teléfono
            $table->string('direccion')->nullable(); // dirección opcional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
