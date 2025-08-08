<?php
define('BASE_PATH', __DIR__);
define('VIEWS_PATH', BASE_PATH . '/public/views');

$config = [
    'debug' => true,
    'api_url' => '/api',
];

session_start();

class Router
{
    private $routes = [];
    private $notFoundCallback;

    public function get($path, $callback)
    {
        $this->routes['GET'][$path] = $callback;
        return $this;
    }

    public function post($path, $callback)
    {
        $this->routes['POST'][$path] = $callback;
        return $this;
    }

    public function notFound($callback)
    {
        $this->notFoundCallback = $callback;
        return $this;
    }

    public function redirect($url)
    {
        header("Location: $url");
        exit;
    }

    public function isAuthenticated()
    {
        return isset($_SESSION['token']);
    }

    public function resolve()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $route => $callback) {
                $pattern = $this->buildPattern($route);
                if (preg_match($pattern, $path, $matches)) {
                    array_shift($matches);
                    return call_user_func_array($callback, $matches);
                }
            }
        }

        if ($this->notFoundCallback) {
            return call_user_func($this->notFoundCallback);
        }

        http_response_code(404);
        echo "Página não encontrada";
    }

    private function buildPattern($route)
    {
        $pattern = preg_replace('/\/:([^\/]+)/', '/([^/]+)', $route);
        return "#^$pattern$#";
    }
}

$router = new Router();

function requireAuth($router)
{
    if (!$router->isAuthenticated()) {
        $router->redirect('/login?error=' . urlencode('Você precisa estar autenticado para acessar esta página'));
    }
}

function view($view, $data = [])
{
    extract($data);

    $viewPath = VIEWS_PATH . '/' . $view . '.phtml';

    if (!file_exists($viewPath)) {
        throw new Exception("View '$view' não encontrada");
    }

    ob_start();

    include $viewPath;

    return ob_get_clean();
}

function jsonResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

$router->get('/', function () use ($router) {
    if ($router->isAuthenticated()) {
        $router->redirect('/dashboard');
    } else {
        $router->redirect('/login');
    }
});

$router->get('/login', function () {
    echo view('auth/login');
});

$router->get('/logout', function () use ($router) {
    session_unset();
    session_destroy();
    $router->redirect('/login?message=' . urlencode('Você saiu do sistema com sucesso'));
});

$router->get('/dashboard', function () use ($router) {
    requireAuth($router);
    echo view('/dashboard');
});

$router->get('/alunos', function () use ($router) {
    requireAuth($router);
    echo view('alunos/listar');
});

$router->get('/alunos/cadastrar', function () use ($router) {
    requireAuth($router);
    echo view('alunos/form');
});

$router->get('/alunos/editar/:id', function ($id) use ($router) {
    requireAuth($router);
    echo view('alunos/form', ['id' => $id]);
});

$router->get('/turmas', function () use ($router) {
    requireAuth($router);
    echo view('turmas/listar');
});

$router->get('/turmas/cadastrar', function () use ($router) {
    requireAuth($router);
    echo view('turmas/form');
});

$router->get('/turmas/editar/:id', function ($id) use ($router) {
    requireAuth($router);
    echo view('turmas/form', ['id' => $id]);
});

$router->get('/matriculas', function () use ($router) {
    requireAuth($router);
    echo view('matriculas/listar');
});

$router->get('/perfil', function () use ($router) {
    requireAuth($router);
    echo view('usuario/perfil');
});

$router->get('/configuracoes', function () use ($router) {
    requireAuth($router);
    echo view('usuario/configuracoes');
});

$router->get('/assets/:type/:file', function ($type, $file) {
    $allowedTypes = ['css', 'js', 'img'];

    if (!in_array($type, $allowedTypes)) {
        http_response_code(403);
        echo "Acesso negado";
        return;
    }

    $filePath = BASE_PATH . "/assets/$type/$file";

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "Arquivo não encontrado";
        return;
    }

    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
    ];

    $ext = pathinfo($file, PATHINFO_EXTENSION);
    if (isset($mimeTypes[$ext])) {
        header("Content-Type: " . $mimeTypes[$ext]);
    }

    readfile($filePath);
});

$router->notFound(function () {
    http_response_code(404);
    echo view('errors/404');
});

try {
    $router->resolve();
} catch (Exception $e) {
    if ($config['debug']) {
        echo "<h1>Erro</h1>";
        echo "<p>" . $e->getMessage() . "</p>";
        echo "<pre>" . $e->getTraceAsString() . "</pre>";
    } else {
        http_response_code(500);
        echo view('errors/500');
    }
}