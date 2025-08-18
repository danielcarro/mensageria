<?php
require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection('127.0.0.1', 5672, 'guest', 'guest');
$channel = $connection->channel();
$channel->exchange_declare('pedido_exchange', 'fanout', false, true, false);

$data = json_encode(['id' => 1, 'amount' => 100]);
$msg = new AMQPMessage($data, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]);

$channel->basic_publish($msg, 'pedido_exchange');
echo "Mensagem enviada\n";

$channel->close();
$connection->close();
