<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // User and role management
            ['Manage Users', 'manage_users'],
            ['Manage Roles', 'manage_roles'],

            // Shop management
            ['Register Shops', 'register_shops'],
            ['Manage Shops', 'manage_shops'],

            // Product management
            ['Manage Products', 'manage_products'],
            ['View Products', 'view_products'],

            // Order management
            ['Place Orders', 'place_orders'],
            ['View Orders', 'view_orders'],
            ['Approve Orders', 'approve_orders'],
            ['Cancel Orders', 'cancel_orders'],

            // Inventory management
            ['View Inventory', 'view_inventory'],
            ['Manage Inventory', 'manage_inventory'],
            ['Receive Stock', 'receive_stock'],

            // Dispatch and delivery
            ['Manage Dispatch', 'manage_dispatch'],
            ['View Assigned Deliveries', 'view_assigned_deliveries'],
            ['Update Delivery Status', 'update_delivery_status'],

            // Payment and finance
            ['Record Payments', 'record_payments'],
            ['Verify Payments', 'verify_payments'],
            ['Manage Credit', 'manage_credit'],

            // Returns and complaints
            ['Submit Returns', 'submit_returns'],
            ['Manage Returns', 'manage_returns'],

            // Reports
            ['View Business Reports', 'view_business_reports'],
            ['View Financial Reports', 'view_financial_reports'],

            // System administration
            ['View Audit Logs', 'view_audit_logs'],
        ];

        foreach ($permissions as [$name, $slug]) {
            $existing = DB::table('permissions')
                ->where('slug', $slug)
                ->first();

            if ($existing) {
                DB::table('permissions')
                    ->where('slug', $slug)
                    ->update([
                        'name' => $name,
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('permissions')->insert([
                    'name' => $name,
                    'slug' => $slug,
                    'description' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
