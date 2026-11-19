<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_receipt_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stock_receipt_id')
                ->constrained('stock_receipts')
                ->restrictOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity_received');

            $table->unique(['stock_receipt_id', 'product_id']);

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE stock_receipt_items
            ADD CONSTRAINT chk_stock_receipt_quantity
            CHECK (quantity_received > 0)
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_receipt_items');
    }
};
