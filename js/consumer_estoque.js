const amqp = require('amqplib');

async function consumeEstoque() {
    const exchange = "pedidos_fanout";
    const queue = "fila_estoque";

    try {
        const connection = await amqp.connect('amqp://guest:guest@127.0.0.7:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'fanout', { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, '');

        console.log("📥 Estoque aguardando mensagens...");

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const pedido = JSON.parse(msg.content.toString());
                console.log("📦 [Estoque] Separando produtos do pedido:", pedido.idPedido);
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error("Erro no Estoque:", error);
    }
}

consumeEstoque();
