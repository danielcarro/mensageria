const amqp = require('amqplib');

async function publishHeaders() {
    const exchange = "pedidos_headers";
    const message = { texto: "Mensagem headers" };
    const headers = { 
        tipo: "notificacao", 
        prioridade: "alta",
        outroHeader: "valor"
    };

    console.log("⏳ Iniciando publisher...");
    
    let connection;
    let channel;
    
    try {
        console.log("🔗 Conectando ao RabbitMQ...");
        connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        console.log("✅ Conexão estabelecida");

        channel = await connection.createChannel();
        console.log("🔄 Canal criado");

        console.log(`📌 Declarando exchange '${exchange}'...`);
        await channel.assertExchange(exchange, 'headers', { 
            durable: false 
        });
        console.log(`✅ Exchange '${exchange}' declarado`);

        console.log("📤 Publicando mensagem com headers:", headers);
        const published = channel.publish(
            exchange, 
            '', 
            Buffer.from(JSON.stringify(message)), 
            {
                headers: headers,
                persistent: false
            }
        );
        
        if (published) {
            console.log("✔️ Mensagem publicada com sucesso");
        } else {
            console.error("❌ Falha ao publicar mensagem");
        }

        // Aguarda brevemente para garantir o envio
        await new Promise(resolve => setTimeout(resolve, 300));
        
    } catch (error) {
        console.error("‼️ ERRO NO PUBLISHER:", error);
    } finally {
        // Fecha os recursos na ordem correta
        try {
            if (channel) {
                console.log("🚪 Fechando canal...");
                await channel.close();
            }
        } catch (err) {
            console.error("Erro ao fechar canal:", err);
        }
        
        try {
            if (connection) {
                console.log("🔌 Desconectando...");
                await connection.close();
            }
        } catch (err) {
            console.error("Erro ao fechar conexão:", err);
        }
        
        console.log("🏁 Publisher finalizado");
    }
}

// Executa o publisher
publishHeaders()
    .then(() => process.exit(0))
    .catch(err => {
        console.error("💥 ERRO GLOBAL:", err);
        process.exit(1);
    });