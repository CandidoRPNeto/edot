<?php
namespace Src\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    private static string $secret = 'tKs9BQwJzGdN3JUPX2zBkrAG4mT5pa6Cxtv2cvbC5JY=';

    public static function generateToken(array $payload, int $expireSeconds = 60 * 60 * 24): string
    {
        $payload['iat'] = time();
        $payload['exp'] = time() + $expireSeconds;

        return JWT::encode($payload, self::$secret, 'HS256');
    }

    public static function verifyToken(string $jwt): array|false
    {
        try {
            return (array) JWT::decode($jwt, new Key(self::$secret, 'HS256'));
        } catch (\Exception $e) {
            return false;
        }
    }
}
