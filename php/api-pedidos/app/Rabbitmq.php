<?php

namespace App;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

final class Rabbitmq
{
    private const RABBITMQ_HOST = 'localhost';
    private const RABBITMQ_PORT = 5672;
    private const RABBITMQ_USER = 'guest';
    private const RABBITMQ_PASS = 'guest';
    private const TIME_WAIT = 2;

    private $con = null;
    private $channel = null;

    public $success = false;

    public function __construct($data)
    {
        try {
            $this->connect();
            $this->config();
            $this->message($data);
            $this->success = true;
            echo "[✔] Mensagem enviada com sucesso!\n";
        } catch (\Exception $e) {
            $this->success = false;
            echo "[✖] Falha ao enviar mensagem: " . $e->getMessage() . "\n";
        } finally {
            $this->close();
        }
    }

    final private function connect()
    {
        while (true) {
            try {
                $this->con = new AMQPStreamConnection(
                    self::RABBITMQ_HOST,
                    self::RABBITMQ_PORT,
                    self::RABBITMQ_USER,
                    self::RABBITMQ_PASS
                );
                break;
            } catch (\Exception $e) {
                echo "Tentando conectar... erro: " . $e->getMessage() . "\n";
                sleep(self::TIME_WAIT);
                continue;
            }
        }
    }

    final private function config()
    {
        $this->channel = $this->con->channel();

        // Declarando a exchange
        $this->channel->exchange_declare(
            'pedido_exchange',
            'fanout',
            false,
            true,  // durable
            false
        );

        // Declarando fila persistente e ligando à exchange
        $this->channel->queue_declare(
            'payment_queue',   // nome da fila
            false,
            true,   // durable
            false,
            false
        );

        $this->channel->queue_bind('payment_queue', 'pedido_exchange');
    }

    final private function message($data)
    {
        $msg = new AMQPMessage(
            $data,
            ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]
        );

        // Enviar apenas 1 vez (removido range 0..100)
        $this->channel->basic_publish($msg, 'pedido_exchange');
    }

    final private function close()
    {
        if ($this->channel) {
            $this->channel->close();
        }
        if ($this->con) {
            $this->con->close();
        }
    }
}
