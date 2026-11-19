<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $rolePermissions = [
            'factory_manager' => [
                'view_products',
                'view_orders',
                'view_inventory',
                'view_business_reports',
                'view_financial_reports',
            ],

            'system_admin' => [
                'manage_users',
                'manage_roles',
                'view_audit_logs',
            ],

            'sales_rep' => [
                'register_shops',
                'manage_shops',
                'view_products',
                'place_orders',
                'view_orders',
            ],

            'store_manager' => [
                'view_products',
                'view_orders',
                'approve_orders',
                'view_inventory',
                'manage_inventory',
                'receive_stock',
                'manage_dispatch',
                'manage_returns',
            ],

            'delivery_person' => [
                'view_assigned_deliveries',
                'update_delivery_status',
            ],

            'shop_owner' => [
                'view_products',
                'place_orders',
                'view_orders',
                'cancel_orders',
                'submit_returns',
            ],

            'finance_officer' => [
                'record_payments',
                'verify_payments',
                'manage_credit',
                'view_financial_reports',
            ],
        ];

        DB::transaction(function () use ($rolePermissions) {
            foreach ($rolePermissions as $roleSlug => $permissionSlugs) {

                $roleId = DB::table('roles')
                    ->where('slug', $roleSlug)
                    ->value('id');

                if ($roleId === null) {
                    throw new RuntimeException(
                        "Role not found: {$roleSlug}"
                    );
                }

                foreach ($permissionSlugs as $permissionSlug) {

                    $permissionId = DB::table('permissions')
                        ->where('slug', $permissionSlug)
                        ->value('id');

                    if ($permissionId === null) {
                        throw new RuntimeException(
                            "Permission not found: {$permissionSlug}"
                        );
                    }

                    DB::table('role_permissions')->insertOrIgnore([
                        'role_id' => $roleId,
                        'permission_id' => $permissionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }
}
