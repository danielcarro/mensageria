const amqp = require('amqplib');

async function publishHeaders() {
    const exchange = "pedidos_headers";
    const message = { texto: "Mensagem headers" };
    const headers = { tipo: "notificacao", prioridade: "alta" };

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'headers', { durable: false });
        channel.publish(exchange, '', Buffer.from(JSON.stringify(message)), { headers });

        console.log("📤 Headers enviado:", message, headers);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error(error);
    }
}

publishHeaders();
