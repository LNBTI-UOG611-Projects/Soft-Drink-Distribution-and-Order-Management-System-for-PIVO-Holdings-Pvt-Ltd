<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Factory Manager / Owner',
                'slug' => 'factory_manager',
                'description' => 'Monitors business operations, sales and reports.',
            ],
            [
                'name' => 'System Administrator',
                'slug' => 'system_admin',
                'description' => 'Manages user accounts, roles and system settings.',
            ],
            [
                'name' => 'Sales Representative',
                'slug' => 'sales_rep',
                'description' => 'Manages shops, sales activities and assisted orders.',
            ],
            [
                'name' => 'Store Manager',
                'slug' => 'store_manager',
                'description' => 'Manages stock, inventory, order approvals and dispatch.',
            ],
            [
                'name' => 'Delivery Person',
                'slug' => 'delivery_person',
                'description' => 'Handles assigned deliveries and delivery status updates.',
            ],
            [
                'name' => 'Shop Owner',
                'slug' => 'shop_owner',
                'description' => 'Places orders and tracks order and delivery status.',
            ],
            [
                'name' => 'Finance Officer',
                'slug' => 'finance_officer',
                'description' => 'Manages payment verification and financial records.',
            ],
        ];

        foreach ($roles as $role) {
            $existingRole = DB::table('roles')
                ->where('slug', $role['slug'])
                ->first();

            if ($existingRole) {
                DB::table('roles')
                    ->where('slug', $role['slug'])
                    ->update([
                        'name' => $role['name'],
                        'description' => $role['description'],
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('roles')->insert([
                    'name' => $role['name'],
                    'slug' => $role['slug'],
                    'description' => $role['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
