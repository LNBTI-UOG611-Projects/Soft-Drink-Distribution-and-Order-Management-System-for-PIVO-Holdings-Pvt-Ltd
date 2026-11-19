<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shop_id')
                ->constrained('shops')
                ->restrictOnDelete();

            $table->foreignId('placed_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('approved_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->dateTime('order_date');

            $table->string('status', 30)
                ->default('pending');

            $table->decimal('total_amount', 12, 2)
                ->default(0);

            $table->text('remarks')->nullable();

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE orders
            ADD CONSTRAINT chk_order_total_amount
            CHECK (total_amount >= 0)
        ");

        DB::statement("
            ALTER TABLE orders
            ADD CONSTRAINT chk_order_status
            CHECK (
                status IN (
                    'pending',
                    'approved',
                    'partially_approved',
                    'rejected',
                    'dispatched',
                    'partially_delivered',
                    'delivered',
                    'cancelled'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
