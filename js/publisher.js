const amqp = require('amqplib');

async function publishMessage() {
    const exchange = "pedidos"; // exchange principal
    const message = {
        idPedido: 12345,
        cliente: { nome: "João Silva", email: "joao.silva@example.com" },
        itens: [
            { produto: "Curso Node.js", quantidade: 1, preco: 199.90 },
            { produto: "Curso RabbitMQ", quantidade: 1, preco: 149.90 }
        ],
        pagamento: { metodo: "cartao_credito", status: "aprovado" },
        total: 349.80,
        data: new Date().toISOString()
    };

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        // cria exchange fanout
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        // publica a mensagem no exchange
        channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));

        console.log("📤 Mensagem enviada:", message);

        await channel.close();
        await connection.close();

    } catch (error) {
        console.error("❌ Erro ao publicar mensagem:", error);
    }
}

publishMessage();
