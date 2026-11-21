<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_receipt_items', function (Blueprint $table) {
            $table->decimal('unit_cost', 12, 2)
                ->nullable();

            $table->decimal('subtotal', 14, 2)
                ->nullable();
        });

        DB::statement("
            ALTER TABLE stock_receipt_items
            ADD CONSTRAINT chk_receipt_item_unit_cost
            CHECK (unit_cost >= 0)
        ");

        DB::statement("
            ALTER TABLE stock_receipt_items
            ADD CONSTRAINT chk_receipt_item_subtotal
            CHECK (subtotal >= 0)
        ");
    }

    public function down(): void
    {
        Schema::table('stock_receipt_items', function (Blueprint $table) {
            $table->dropColumn(['unit_cost', 'subtotal']);
        });
    }
};
