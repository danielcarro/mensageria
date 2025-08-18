const amqp = require('amqplib');

async function publishDirect() {
    const exchange = "pedidos_direct";
    const routingKey = "pagamento_aprovado"; // envia só para filas que usam essa chave
    const message = { texto: "Mensagem direct", status: "aprovado" };

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: false });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

        console.log("📤 Direct enviado:", message);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error(error);
    }
}

publishDirect();
