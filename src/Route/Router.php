<?php
namespace Src\Route;

use ReflectionClass;
use Src\Helpers\JwtHelper;
use Src\Request\Request;

class Router
{
    private array $withoutAuth;

    private array $routes;

    public function __construct(private Request $request)
    {
    }

    public function handler()
    {
        try {
            foreach ($this->routes as $route => $routeController) {
                if ($this->request->id) {
                    $route = preg_replace('/:\w+/', $this->request->id, $route);
                }
                if ($route === $this->request->route) {
                    if (!in_array($route, $this->withoutAuth)) {
                        $this->authMiddleware();
                    }
                    $controller = $this->resolveController($routeController[0]);
                    $return = $this->sendToMethod($controller, $routeController[1]);
                    http_response_code($return['code']);
                    echo json_encode($return['data']);
                }
            }
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                'message' => 'Houve um problema no backend',
                'error' => $th->getMessage()
            ]);
            exit;
        }
    }

    public function addRoutes($route, $controller, $method, $needAuth = true)
    {
        if (!$needAuth) {
            $this->withoutAuth[] = $route;
        }
        $this->routes[$route] = [$controller, $method];
    }

    public function addResource($resourceName, $controller, $needAuth = true)
    {
        $this->addRoutes("/{$resourceName}/create", $controller, 'create', $needAuth);
        $this->addRoutes("/{$resourceName}/update/:id", $controller, 'update', $needAuth);
        $this->addRoutes("/{$resourceName}/delete/:id", $controller, 'delete', $needAuth);
        $this->addRoutes("/{$resourceName}/index", $controller, 'index', $needAuth);
        $this->addRoutes("/{$resourceName}/find", $controller, 'search', $needAuth);
        $this->addRoutes("/{$resourceName}/find/:id", $controller, 'show', $needAuth);
    }

    private function sendToMethod($controller, $method): array
    {
        $response = ['code' => 200];
        switch ($this->request->method) {
            case 'GET':
                
                if ($method == 'getOptionList') {
                    $response['data'] = call_user_func([$controller, $method], $this->request->search);
                }
                else if ($this->request->id)
                    $response['data'] = call_user_func([$controller, $method], $this->request->id);
                else if ($this->request->search && $this->request->page)
                    $response['data'] = call_user_func([$controller, $method], $this->request->page, $this->request->search, $this->request->filter);
                else
                    $response['data'] = call_user_func([$controller, $method], $this->request->page);
                break;
            case 'POST':
                $response['data'] = call_user_func([$controller, $method], $this->request->data);
                break;
            case 'PUT':
                $response['data'] = call_user_func([$controller, $method], $this->request->id, $this->request->data);
                break;
            case 'DELETE':
                $response['data'] = call_user_func([$controller, $method], $this->request->id);
                break;
            default:
                $response = [
                    'code' => 405,
                    'data' => ['message' => 'Método não permitido']
                ];
        }
        return $response;
    }

    private function resolveController(string $className)
    {
        $reflectionClass = new ReflectionClass($className);
        $constructor = $reflectionClass->getConstructor();

        if (!$constructor) {
            return new $className();
        }

        $params = $constructor->getParameters();
        $dependencies = [];

        foreach ($params as $param) {
            $type = $param->getType();
            if ($type && !$type->isBuiltin()) {
                $dependencyClass = $type->getName();
                $dependencies[] = $this->resolveController($dependencyClass);
            }
        }

        return $reflectionClass->newInstanceArgs($dependencies);
    }

    private function authMiddleware(): void
    {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Token ausente']);
            exit;
        }

        $jwt = str_replace('Bearer ', '', $headers['Authorization']);
        $decoded = JwtHelper::verifyToken($jwt);

        if (!$decoded) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou expirado']);
            exit;
        }

        if ($decoded['role'] !== 'ADM') {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado']);
            exit;
        }
    }

}
