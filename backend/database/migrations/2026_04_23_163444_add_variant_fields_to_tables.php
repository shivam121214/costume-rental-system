<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('variants')->nullable()->after('sizes');
        });

        Schema::table('booking_requests', function (Blueprint $table) {
            $table->string('variant')->nullable()->after('product_id');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('variant')->nullable()->after('product_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('variants');
        });

        Schema::table('booking_requests', function (Blueprint $table) {
            $table->dropColumn('variant');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('variant');
        });
    }
};