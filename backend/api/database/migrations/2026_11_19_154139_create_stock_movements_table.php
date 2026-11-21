<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete();

            $table->string('movement_type', 30);

            $table->integer('quantity_change');

            $table->string('reference_type', 50)
                ->nullable();

            $table->unsignedBigInteger('reference_id')
                ->nullable();

            $table->foreignId('performed_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->index(['reference_type', 'reference_id']);
        });

        DB::statement("
            ALTER TABLE stock_movements
            ADD CONSTRAINT chk_stock_movement_quantity
            CHECK (quantity_change <> 0)
        ");

        DB::statement("
            ALTER TABLE stock_movements
            ADD CONSTRAINT chk_stock_movement_reference
            CHECK (
                (reference_type IS NULL AND reference_id IS NULL)
                OR
                (reference_type IS NOT NULL AND reference_id IS NOT NULL)
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
