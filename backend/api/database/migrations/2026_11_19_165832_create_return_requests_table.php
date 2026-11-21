<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('return_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shop_id')
                ->constrained('shops')
                ->restrictOnDelete();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->restrictOnDelete();

            $table->foreignId('requested_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('reviewed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->dateTime('request_date');

            $table->text('reason');

            $table->string('status', 30)
                ->default('pending');

            $table->dateTime('reviewed_at')
                ->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE return_requests
            ADD CONSTRAINT chk_return_request_status
            CHECK (
                status IN (
                    'pending',
                    'under_review',
                    'approved',
                    'partially_approved',
                    'rejected',
                    'completed',
                    'cancelled'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('return_requests');
    }
};
