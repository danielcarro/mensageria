<?php

require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;

// Configurações
const RB_HOST = 'localhost';
const RB_PORT = 5672;
const RB_USER = 'guest';
const RB_PASS = 'guest';

// Tentativas de conexão
$tries = 0;
$maxTries = 10;
while ($tries < $maxTries) {
    try {
        $connection = new AMQPStreamConnection(RB_HOST, RB_PORT, RB_USER, RB_PASS);
        break;
    } catch (\Exception $e) {
        $tries++;
        var_dump("Erro ao conectar RabbitMQ: " . $e->getMessage());
        sleep(2);
    }
}

if ($tries === $maxTries) {
    die("Não foi possível conectar ao RabbitMQ após 10 tentativas.");
}

$channel = $connection->channel();

// Declara a exchange
$channel->exchange_declare('pedido_exchange', 'fanout', false, true, false);

// Declara a fila
$channel->queue_declare('payment_queue', false, true, false, false);

// Faz o bind da fila na exchange
$channel->queue_bind('payment_queue', 'pedido_exchange');

echo " [*] Esperando pedidos. Para sair pressione CTRL+C\n";

// Callback para processar mensagens
$callback = function($msg) {
    echo date('m/d/Y h:i:s a') . " [x] Validando Pagamento: " . $msg->body . "\n";

    $body = json_decode($msg->body, true);

    if (!$body || !isset($body['id'])) {
        echo "Mensagem inválida: " . $msg->body . "\n";
        return;
    }

    try {
        $pdo = new \PDO('sqlite:' . __DIR__ . './database/db/pedidos.db');
        $sql = "UPDATE Pedidos SET payment = 1 WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$body['id']]);
        echo "Pedido ID {$body['id']} atualizado com sucesso.\n";
    } catch (\Exception $e) {
        echo "Erro ao atualizar pedido: " . $e->getMessage() . "\n";
    }
};

// Consome a fila
$channel->basic_consume('payment_queue', '', false, true, false, false, $callback);

// Mantém escutando a fila
while ($channel->is_open()) {
    $channel->wait();
}

$channel->close();
$connection->close();
