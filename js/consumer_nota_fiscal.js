const amqp = require('amqplib');

async function consumeNotaFiscal() {
    const exchange = "pedidos_fanout";
    const queue = "fila_nota_fiscal";

    try {
        const connection = await amqp.connect('amqp://guest:guest@127.0.0.7:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'fanout', { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, '');

        console.log("📥 Nota Fiscal aguardando mensagens...");

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const pedido = JSON.parse(msg.content.toString());
                console.log("🧾 [Nota Fiscal] Emitindo NF do pedido:", pedido.idPedido);
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error("Erro na Nota Fiscal:", error);
    }
}

consumeNotaFiscal();
