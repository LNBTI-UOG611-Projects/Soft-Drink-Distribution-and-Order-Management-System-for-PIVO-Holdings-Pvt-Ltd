<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->restrictOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity_ordered');

            $table->unsignedInteger('quantity_approved')
                ->nullable();

            $table->decimal('unit_price', 12, 2);

            $table->decimal('subtotal', 12, 2);

            $table->unique(['order_id', 'product_id']);

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE order_items
            ADD CONSTRAINT chk_order_item_quantities
            CHECK (
                quantity_ordered > 0
                AND (
                    quantity_approved IS NULL
                    OR (
                        quantity_approved >= 0
                        AND quantity_approved <= quantity_ordered
                    )
                )
            )
        ");

        DB::statement("
            ALTER TABLE order_items
            ADD CONSTRAINT chk_order_item_prices
            CHECK (
                unit_price >= 0
                AND subtotal >= 0
                AND subtotal = ROUND(quantity_ordered * unit_price, 2)
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
