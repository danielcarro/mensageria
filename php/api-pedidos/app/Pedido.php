<?php

namespace App;

use PDO;
use Exception;

class Pedido
{
    private $produto;
    private $dbPath;

    public function __construct()
    {
        // Pega o produto enviado via POST, se não existir, null
        $this->produto = $_POST['produto'] ?? null;

        // Caminho do banco de dados SQLite
        $this->dbPath = realpath(__DIR__ . '/../../database/db/pedidos.db');

        if (!$this->dbPath) {
            // Cria a pasta e o arquivo se não existir
            $dbDir = __DIR__ . '/../../database/db';
            if (!is_dir($dbDir)) {
                mkdir($dbDir, 0777, true);
            }
            $this->dbPath = $dbDir . '/pedidos.db';
        }

        // Configura CORS
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    private function returnJson(array $data)
    {
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    private function connect()
    {
        try {
            $pdo = new PDO('sqlite:' . $this->dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Cria tabela se não existir
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS Pedidos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    produtos TEXT,
                    email TEXT,
                    distributor TEXT,
                    payment TEXT
                )
            ");

            return $pdo;
        } catch (Exception $e) {
            $this->returnJson(['error' => 'Erro ao conectar ao banco: ' . $e->getMessage()]);
        }
    }

    public function index()
    {
        $pdo = $this->connect();

        $stmt = $pdo->query("SELECT * FROM Pedidos");
        $data = [];

        while ($linha = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = [
                'id' => $linha['id'],
                'produtos' => $linha['produtos'] ?? null,
                'email' => $linha['email'] ?? null,
                'distributor' => $linha['distributor'] ?? null,
                'payment' => $linha['payment'] ?? null
            ];
        }

        $this->returnJson(['pedidos' => $data]);
    }

    public function store()
    {
        if (!$this->produto) {
            $this->returnJson(['error' => 'Produto não informado']);
        }

        $pdo = $this->connect();

        $stmt = $pdo->prepare("INSERT INTO Pedidos (produtos) VALUES (?)");
        $stmt->execute([$this->produto]);

        $produtoData = [
            'id' => $pdo->lastInsertId(),
            'produto' => $this->produto
        ];

        // Envia para RabbitMQ se a classe existir
        $rabbitStatus = 'RabbitMQ não configurado';
        if (class_exists('\App\Rabbitmq')) {
            $rabbit = new \App\Rabbitmq(json_encode($produtoData));
            $rabbitStatus = property_exists($rabbit, 'success') && $rabbit->success
                ? 'Mensagem enviada com sucesso'
                : 'Falha ao enviar a mensagem';
        }

        $produtoData['rabbit_status'] = $rabbitStatus;

        $this->returnJson($produtoData);
    }

    public function update()
    {
        $this->returnJson(['message' => 'Pedido atualizado']);
    }
}
