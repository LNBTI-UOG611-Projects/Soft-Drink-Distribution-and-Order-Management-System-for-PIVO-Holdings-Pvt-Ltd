<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('delivery_id')
                ->constrained('deliveries')
                ->restrictOnDelete();

            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity_dispatched');

            $table->unsignedInteger('quantity_delivered')
                ->nullable();

            $table->unique(['delivery_id', 'order_item_id']);

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE delivery_items
            ADD CONSTRAINT chk_delivery_item_quantities
            CHECK (
                quantity_dispatched > 0
                AND (
                    quantity_delivered IS NULL
                    OR (
                        quantity_delivered >= 0
                        AND quantity_delivered <= quantity_dispatched
                    )
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_items');
    }
};
