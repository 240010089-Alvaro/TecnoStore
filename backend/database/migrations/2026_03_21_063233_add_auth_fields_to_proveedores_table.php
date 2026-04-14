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
       Schema::table('proveedores', function (Blueprint $table) {
    if (!Schema::hasColumn('proveedores', 'name')) {
        $table->string('name');
    }

    if (!Schema::hasColumn('proveedores', 'email')) {
        $table->string('email')->unique();
    }

    if (!Schema::hasColumn('proveedores', 'password')) {
        $table->string('password');
    }
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proveedores', function (Blueprint $table) {
            $table->dropColumn(['name', 'email', 'password']);
        });
    }
};
