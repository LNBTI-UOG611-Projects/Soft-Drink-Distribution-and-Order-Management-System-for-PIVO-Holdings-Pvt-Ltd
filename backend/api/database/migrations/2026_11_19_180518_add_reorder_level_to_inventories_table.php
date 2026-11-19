<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->unsignedInteger('reorder_level')
                ->default(0);
        });

        DB::statement("
            ALTER TABLE inventories
            ADD CONSTRAINT chk_inventory_reorder_level
            CHECK (reorder_level >= 0)
        ");
    }

    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropColumn('reorder_level');
        });
    }
};
