const amqp = require('amqplib');

async function publishDirect() {
    const exchange = "pedidos_direct";

    const mensagens = [
        { key: "pagamento_aprovado", conteudo: { pedido: 101, status: "aprovado" } },
        { key: "estoque_reservado", conteudo: { pedido: 101, itens: 3 } },
        { key: "nota_emitida", conteudo: { pedido: 101, numero: "NF-2025" } },
    ];

    const connection = await amqp.connect('amqp://guest:guest@127.0.0.7:5672');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'direct', { durable: false });

    for (const msg of mensagens) {
        channel.publish(exchange, msg.key, Buffer.from(JSON.stringify(msg.conteudo)));
        console.log(`📤 Enviado (${msg.key}):`, msg.conteudo);
    }

    await channel.close();
    await connection.close();
}

publishDirect();
