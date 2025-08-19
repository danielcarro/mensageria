const amqp = require('amqplib');

async function universalConsumer() {
    let connection;

    try {
        connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672');

        connection.on('error', (err) => {
            console.error("Erro na conexão:", err.message);
        });

        connection.on('close', () => {
            console.warn("Conexão fechada. Tentando reconectar em 5s...");
            setTimeout(universalConsumer, 5000);
        });

        const channel = await connection.createChannel();

        channel.on('error', (err) => {
            console.error("Erro no canal:", err.message);
        });

        // Configuração dos exchanges
        const exchanges = [
            { name: 'pedidos_fanout', type: 'fanout', key: '' },
            { name: 'pedidos_direct', type: 'direct', key: 'pagamento_aprovado' },
            { name: 'pedidos_topic', type: 'topic', key: 'pedido.*.cartao' },
            {
                name: 'pedidos_headers',
                type: 'headers',
                key: {
                    'x-match': 'all',  // Teste com 'any' se necessário
                    'tipo': 'notificacao',
                    'prioridade': 'alta'
                }
            }
        ];

        // Cria fila exclusiva
        const queue = await channel.assertQueue('', {
            exclusive: true,
            durable: false
        });

        console.log("Consumer pronto. Fila temporária:", queue.queue);

        // Faz binding para cada exchange
        for (const ex of exchanges) {
            try {
                await channel.assertExchange(ex.name, ex.type, { durable: false });

                if (ex.type === 'headers') {
                    //  Formato correto para headers
                    await channel.bindQueue(queue.queue, ex.name, '', {
                        arguments: ex.headers
                    });
                    console.log(`Bind HEADERS: ${queue.queue} -> ${ex.name} com`, ex.headers);
                } else {
                    await channel.bindQueue(queue.queue, ex.name, ex.key);
                    console.log(`Bind ${ex.type}: ${queue.queue} -> ${ex.name} com chave '${ex.key}'`);
                }
            } catch (bindErr) {
                console.error(`Erro no bind com ${ex.name}:`, bindErr.message);
            }
        }

        // Consumidor principal
        channel.consume(queue.queue, (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    const exchange = msg.fields.exchange;
                    const headers = msg.properties.headers || {};
                    const routingKey = msg.fields.routingKey;

                    console.log('\n--- NOVA MENSAGEM ---');
                    console.log('Exchange:', exchange);
                    console.log('Routing Key:', routingKey);
                    console.log('Conteúdo:', content);
                    console.log('Headers:', headers);
                    console.log('---------------------');

                    channel.ack(msg);
                } catch (parseErr) {
                    console.error("Erro ao processar mensagem:", parseErr);
                }
            }
        }, { noAck: false });

        console.log("Aguardando mensagens...");

    } catch (err) {
        console.error("Erro inicial:", err.message);
        if (connection) await connection.close();
        setTimeout(universalConsumer, 5000);
    }
}
universalConsumer().catch(console.error);