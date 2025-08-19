const amqp = require('amqplib');

async function publishTopic() {
    const exchange = "pedidos_topic";
    const routingKey = "pedido.novo.cartao";
    const message = { texto: "Mensagem topic", metodo: "cartao" };

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'topic', { durable: false });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

        console.log("📤 Topic enviado:", message);
        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

publishTopic();