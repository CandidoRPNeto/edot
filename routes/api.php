<?php

use App\Http\Controllers\DealerController;
use Illuminate\Support\Facades\Route;

Route::prefix('/api', function () {
    Route::post('/login', [DealerController::class, 'login']);
    Route::post('/register', [DealerController::class, 'register']);
    Route::prefix('/dealer', function () {
        Route::get('/invites', [DealerController::class, 'getInvites']);
        Route::get('/stores', [DealerController::class, 'getStores']);
        Route::get('/runs', [DealerController::class, 'getRuns']);
        Route::get('/deliveries', [DealerController::class, 'getDeliveries']);
        Route::prefix('/delivery', function () {
            Route::get('/start', [DealerController::class, 'startRun']);
            Route::get('/finish', [DealerController::class, 'finishDelivery']);
        });
    });
});