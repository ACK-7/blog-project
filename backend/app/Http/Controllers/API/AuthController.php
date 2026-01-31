<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * POST /api/register
     */
    public function register(Request $request)
    {
        // Clean phone number (remove spaces and non-digit characters except +)
        $phoneNumber = $request->phone;
        if ($phoneNumber) {
            $phoneNumber = preg_replace('/[^\+\d]/', '', $phoneNumber);
        }
        
        // Validate incoming data with simpler phone validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        // Very simple phone validation - just check it exists and has reasonable format
        if (empty($phoneNumber)) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['phone' => ['Phone number is required.']]
            ], 422);
        }
        
        // More lenient validation - just check it starts with + and has digits
        if (!preg_match('/^\+\d{8,15}$/', $phoneNumber)) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['phone' => ['Please enter a valid phone number starting with + (e.g., +256779901499).']]
            ], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $phoneNumber,
            'password' => Hash::make($validated['password']),
        ]);

        // Create an API token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return JSON response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Login an existing user
     * POST /api/login
     */
    public function login(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create an API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return JSON response
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    /**
     * Logout the authenticated user
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Delete the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    /**
     * Get authenticated user details
     * GET /api/user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ], 200);
    }
}