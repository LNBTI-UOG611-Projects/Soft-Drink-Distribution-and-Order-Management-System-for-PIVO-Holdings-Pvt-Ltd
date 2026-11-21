<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->unique()
                ->constrained('products')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity_on_hand')
                ->default(0);

            $table->unsignedInteger('quantity_reserved')
                ->default(0);

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE inventories
            ADD CONSTRAINT chk_inventory_quantities
            CHECK (
                quantity_on_hand >= 0
                AND quantity_reserved >= 0
                AND quantity_reserved <= quantity_on_hand
            )
        ");
    }


    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
