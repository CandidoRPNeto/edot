<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Src\Request\Request;
use Src\Route\Router;
use Src\Controllers\{AuthController, ClassroomController, DashboardController, EnrollmentsController, StudentController};

$request = new Request();
$request->capture();
$route = new Router($request);
$route->addRoutes('/auth/login', AuthController::class, 'login', false);
$route->addRoutes('/dashboard/quantity', DashboardController::class, 'getInfo');
$route->addRoutes('/student/option', StudentController::class, 'getOptionList');
$route->addRoutes('/classroom/option', ClassroomController::class, 'getOptionList');
$route->addResource('classroom', ClassroomController::class);
$route->addResource('student', StudentController::class);
$route->addResource('enrollment', EnrollmentsController::class);
$route->handler();