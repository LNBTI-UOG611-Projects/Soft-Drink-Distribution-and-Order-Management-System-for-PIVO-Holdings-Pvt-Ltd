<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();

            $table->string('shop_name', 150);
            $table->text('address');
            $table->string('contact_number', 20);

            $table->string('registration_status', 30)
                ->default('pending');

            $table->decimal('credit_limit', 12, 2)
                ->default(0);

            $table->decimal('outstanding_balance', 12, 2)
                ->default(0);

            $table->foreignId('owner_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('managed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
