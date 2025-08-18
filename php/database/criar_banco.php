<?php
// Caminho onde o banco será salvo
$dbPath = __DIR__ . '/db/pedidos.db';

// Cria a pasta /db caso não exista
if (!file_exists(__DIR__ . '/db')) {
    mkdir(__DIR__ . '/db', 0777, true);
}

// Conexão com o banco
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Cria a tabela Pedidos
$sql = "
CREATE TABLE IF NOT EXISTS Pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    payment TEXT,
    distributor TEXT,
    produtos TEXT
);
";
$pdo->exec($sql);

echo "Banco de dados criado em: $dbPath\n";
echo "Tabela Pedidos pronta!\n";
