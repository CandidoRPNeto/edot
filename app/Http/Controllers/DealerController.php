<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreDealerRequest;
use App\Models\Dealer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DealerController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        if (!is_null($user->dealer)) {
            return response()->json(['message' => 'Need create account'], 401);
        }

        // $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'success',
            // 'access_token' => $token,
            'token_type' => 'Bearer'
        ],200);
    }

    public function register(StoreDealerRequest $request)
    {
        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'picture' => $request->get('picture'),
            'password' => $request->get('password')
        ]);
        Dealer::create(['user_id' => $user->id]);
        return response()->json([ 'message' => 'success' ], 200);
    }

    public function getInvites()
    {
        //
    }

    public function getStores()
    {
        //
    }

    public function getRuns()
    {
        //
    }

    public function getDeliveries()
    {
        //
    }

    public function startRun()
    {
        // inicia a primeira entrega e atualiza o status do dealer
    }
    public function finishDelivery()
    {
        // termina a entrega e começa outra e caso a run não tenha outra então encerra a run e atualiza o status do dealer
    }
}
