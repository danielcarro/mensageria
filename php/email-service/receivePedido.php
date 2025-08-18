<?php

require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;

// Configurações
const RB_HOST = 'rabbitmq';
const RB_PORT = 5672;
const RB_USER = 'guest';
const RB_PASS = 'guest';

// Tenta conectar até conseguir
while (true) {
    try {
        $connection = new AMQPStreamConnection(RB_HOST, RB_PORT, RB_USER, RB_PASS);
        break;
    } catch (\Exception $e) {
        var_dump("Erro ao conectar RabbitMQ: " . $e->getMessage());
        sleep(2);
    }
}

$channel = $connection->channel();

// Declara a exchange
$channel->exchange_declare('pedido_exchange', 'fanout', false, true, false);

// Declara a fila
$channel->queue_declare('email_queue', false, true, false, false);

// Faz o bind da fila na exchange
$channel->queue_bind('email_queue', 'pedido_exchange');

echo " [*] Esperando mensagens de email. Para sair pressione CTRL+C\n";

// Callback para processar mensagens
$callback = function($msg) {
    echo date('m/d/Y h:i:s a') . " [x] Novo email: " . $msg->body . "\n";

    $body = json_decode($msg->body, true);

    if (!$body || !isset($body['id'])) {
        echo "Mensagem inválida: " . $msg->body . "\n";
        return;
    }

    try {
        $pdo = new \PDO('sqlite:' . __DIR__ . '/../db/pedidos.db');
        $sql = "UPDATE Pedidos SET email = 1 WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$body['id']]);
        echo "Pedido ID {$body['id']} atualizado com sucesso.\n";
    } catch (\Exception $e) {
        echo "Erro ao atualizar pedido: " . $e->getMessage() . "\n";
    }
};

// Consome a fila
$channel->basic_consume('email_queue', '', false, true, false, false, $callback);

// Mantém escutando a fila
while ($channel->is_open()) {
    $channel->wait();
}

$channel->close();
$connection->close();
