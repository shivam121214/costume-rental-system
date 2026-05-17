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
        Schema::table('products', function (Blueprint $table) {
            // Drop the old category column
            $table->dropColumn('category');
            
            // Add the new theme column with enum values
            $table->enum('theme', [
                'Christmas',
                'Halloween',
                'Birthday',
                'Wedding',
                'Superhero',
                'Princess',
                'Animal',
                'Funny',
                'Scary',
                'Seasonal'
            ])->default('Seasonal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the theme column
            $table->dropColumn('theme');
            
            // Restore the category column
            $table->string('category')->nullable();
        });
    }
};
