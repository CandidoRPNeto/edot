<?php
namespace Src\Builder;

class BuildProject {
    public function __construct() {
        $dir = __DIR__ . '/../../migrations';
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                throw new \Exception("❌ Falha ao criar a pasta 'migrations'. Verifique permissões.\n");
            }
            echo "📁 Pasta 'migrations' criada com sucesso.\n";
        }
        $this->buildMigrateFiles();
    }

    public function buildMigrateFiles(): void {
        echo "Criando arquivos pra migração";
    }

}