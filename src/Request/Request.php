<?php
namespace Src\Request;

class Request
{
    public string $method = 'GET';
    public string $resource;
    public string|null $id;

    public string $route;

    public array $data = [];

    public string $page;

    public string|bool $search;

    public string|bool $filter;

    public function capture()
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type");
        $route = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', trim($route, '/'));
        $this->resource = $uri[1] ?? null;
        $this->id = $uri[3] ?? null;
        $this->route = str_replace('/api', '', $route);
        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method === 'POST' || $this->method === 'PUT') {
            $this->data = json_decode(file_get_contents("php://input"), true);
        }
        $this->page = $_GET['page'] ?? "1";
        $this->search = $_GET['search'] ?? false;
        $this->filter = $_GET['filter'] ?? false;
    }
}