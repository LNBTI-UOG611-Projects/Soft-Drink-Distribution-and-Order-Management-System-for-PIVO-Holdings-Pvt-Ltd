<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_number', 50)
                ->unique();

            $table->foreignId('order_id')
                ->unique()
                ->constrained('orders')
                ->restrictOnDelete();

            $table->date('issue_date');

            $table->date('due_date');

            $table->decimal('total_amount', 12, 2);

            $table->string('status', 30)
                ->default('unpaid');

            $table->timestamps();
        });

        DB::statement("
            ALTER TABLE invoices
            ADD CONSTRAINT chk_invoice_amount
            CHECK (total_amount >= 0)
        ");

        DB::statement("
            ALTER TABLE invoices
            ADD CONSTRAINT chk_invoice_dates
            CHECK (due_date >= issue_date)
        ");

        DB::statement("
            ALTER TABLE invoices
            ADD CONSTRAINT chk_invoice_status
            CHECK (
                status IN (
                    'unpaid',
                    'partially_paid',
                    'paid',
                    'cancelled'
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
