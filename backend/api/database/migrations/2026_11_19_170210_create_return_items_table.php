<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('return_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('return_request_id')
                ->constrained('return_requests')
                ->restrictOnDelete();

            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity_requested');

            $table->unsignedInteger('quantity_approved')
                ->nullable();

            $table->string('item_condition', 30);

            $table->unique([
                'return_request_id',
                'order_item_id'
            ]);

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE return_items
            ADD CONSTRAINT chk_return_item_quantities
            CHECK (
                quantity_requested > 0
                AND (
                    quantity_approved IS NULL
                    OR (
                        quantity_approved >= 0
                        AND quantity_approved <= quantity_requested
                    )
                )
            )
        ");

        DB::statement("
            ALTER TABLE return_items
            ADD CONSTRAINT chk_return_item_condition
            CHECK (
                item_condition IN (
                    'damaged',
                    'expired',
                    'incorrect',
                    'defective',
                    'other'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
