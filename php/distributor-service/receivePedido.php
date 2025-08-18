<?php

require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

const RB_HOST = 'rabbitmq';
const RB_PORT = 5672;
const RB_USER = 'guest';
const RB_PASS = 'guest';

/**
 * Inicia a conexão com retry
 */
while (true) {
    try {
        $connection = new AMQPStreamConnection(RB_HOST, RB_PORT, RB_USER, RB_PASS);
        break;
    } catch (\Exception $e) {
        var_dump("Erro ao conectar: " . $e->getMessage());
        sleep(2);
    }
}

$channel = $connection->channel();

// Declara exchange
$channel->exchange_declare('pedido_exchange', 'fanout', false, true, false);

// Declara fila
$channel->queue_declare('distributor_queue', false, true, false, false);

// Faz bind da fila na exchange
$channel->queue_bind('distributor_queue', 'pedido_exchange');

echo " [*] Esperando pedidos. Para sair pressione CTRL+C\n";

// Callback para processar as mensagens
$callback = function($msg) {
    echo date('m/d/Y h:i:s a') . " [x] Validando Pagamento: " . $msg->body . "\n";

    $body = json_decode($msg->body, true);

    if (!$body || !isset($body['id'])) {
        echo "Mensagem inválida: " . $msg->body . "\n";
        return;
    }

    $pdo = new \PDO('sqlite:' . __DIR__ . '/../db/pedidos.db');

    $sql = "UPDATE Pedidos SET distributor = 1 WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$body['id']]);

    echo "Pedido ID {$body['id']} atualizado com sucesso.\n";
};

// Consome a fila
$channel->basic_consume('distributor_queue', '', false, true, false, false, $callback);

// Mantém escutando a fila
while ($channel->is_open()) {
    $channel->wait();
}

$channel->close();
$connection->close();
