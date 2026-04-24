<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // public function login(Request $request)
    // {
    //     $data = $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required'
    //     ]);

    //     $user = User::where('email', $data['email'])->first();

    //     if (!$user || !Hash::check($data['password'], $user->password)) {
    //         return response()->json([
    //             'message' => 'Invalid credentials'
    //         ], 401);
    //     }

    //     return response()->json([
    //         'message' => 'Login successful',
    //         'user' => $user
    //     ]);
    // }
//     public function login(Request $request)
// {
//     try {
//         $data = $request->validate([
//             'email' => 'required|email',
//             'password' => 'required'
//         ]);

//         $user = User::where('email', $data['email'])->first();

//         if (!$user) {
//             return response()->json(['message' => 'User not found'], 404);
//         }

//         return response()->json([
//             'user' => $user,
//             'password_column' => $user->password
//         ]);
//     } catch (\Throwable $e) {
//         return response()->json([
//             'error' => $e->getMessage(),
//             'line' => $e->getLine(),
//             'file' => $e->getFile()
//         ], 500);
//     }
// }

// public function login(Request $request)
// {
//     $data = $request->validate([
//         'email' => 'required|email',
//         'password' => 'required'
//     ]);

//     $user = User::where('email', $data['email'])->first();

//     if (!$user) {
//         return response()->json([
//             'message' => 'Invalid credentials'
//         ], 401);
//     }

//     if (!password_verify($data['password'], $user->password)) {
//         return response()->json([
//             'message' => 'Invalid credentials'
//         ], 401);
//     }

//     return response()->json([
//         'message' => 'Login successful',
//         'user' => $user
//     ]);
// }

public function login(Request $request)
{
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => $user
    ]);
}
}