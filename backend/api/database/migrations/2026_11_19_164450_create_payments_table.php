<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shop_id')
                ->constrained('shops')
                ->restrictOnDelete();

            $table->foreignId('recorded_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('verified_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->date('payment_date');

            $table->decimal('amount', 12, 2);

            $table->string('payment_method', 30);

            $table->string('reference_number', 100)
                ->nullable();

            $table->string('status', 30)
                ->default('pending');

            $table->text('remarks')->nullable();

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payment_amount
            CHECK (amount > 0)
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payment_method
            CHECK (
                payment_method IN (
                    'cash',
                    'cheque',
                    'bank_transfer'
                )
            )
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payment_status
            CHECK (
                status IN (
                    'pending',
                    'verified',
                    'rejected'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
