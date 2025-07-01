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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
            $table->string('item_name_en');
            $table->string('item_name_ar');
            $table->text('item_description_en')->nullable();
            $table->text('item_description_ar')->nullable();
            $table->decimal('unit_price', 8, 2);
            $table->integer('quantity');
            $table->decimal('total_price', 10, 2);
            $table->string('category');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
