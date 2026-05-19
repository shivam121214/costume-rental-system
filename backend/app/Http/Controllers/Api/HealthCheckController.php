<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class HealthCheckController
{
    /**
     * Perform a health check on the application
     * 
     * @return JsonResponse
     */
    public function check(): JsonResponse
    {
        $status = [
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'checks' => [
                'database' => $this->checkDatabase(),
                'cache' => $this->checkCache(),
            ],
        ];

        $allHealthy = collect($status['checks'])->every(fn($check) => $check['status'] === 'ok');
        
        if (!$allHealthy) {
            $status['status'] = 'degraded';
            return response()->json($status, 503);
        }

        return response()->json($status, 200);
    }

    /**
     * Check database connectivity
     * 
     * @return array
     */
    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return [
                'status' => 'ok',
                'message' => 'Database connection successful',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'failed',
                'message' => 'Database connection failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check cache connectivity
     * 
     * @return array
     */
    private function checkCache(): array
    {
        try {
            $testKey = 'health_check_' . time();
            Cache::put($testKey, true, 10);
            $cached = Cache::get($testKey);
            Cache::forget($testKey);
            
            if ($cached) {
                return [
                    'status' => 'ok',
                    'message' => 'Cache working',
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'failed',
                'message' => 'Cache check failed: ' . $e->getMessage(),
            ];
        }

        return [
            'status' => 'failed',
            'message' => 'Cache check returned false',
        ];
    }
}
