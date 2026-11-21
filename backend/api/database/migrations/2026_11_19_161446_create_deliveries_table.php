<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->restrictOnDelete();

            $table->foreignId('assigned_to_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('dispatched_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('status', 30)
                ->default('pending');

            $table->date('scheduled_date')->nullable();

            $table->dateTime('dispatched_at')->nullable();

            $table->dateTime('delivered_at')->nullable();

            $table->string('proof_of_delivery', 255)
                ->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->index(['assigned_to_user_id', 'status']);
        });

        DB::statement("
            ALTER TABLE deliveries
            ADD CONSTRAINT chk_delivery_status
            CHECK (
                status IN (
                    'pending',
                    'assigned',
                    'dispatched',
                    'in_transit',
                    'partially_delivered',
                    'delivered',
                    'failed',
                    'cancelled'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
