const RABBITMQ_USER = "guest";
const RABBITMQ_PASS = "guest";
const RABBITMQ_HOST = "http://localhost:15672";
const MENSAGENS_LIMITE = 5;       
const POLL_INTERVAL = 5000;      

// --------------------
// Auxiliar fetch GET
// --------------------
async function getRabbitAPI(path) {
  const url = `${RABBITMQ_HOST}${path}`;
  const auth = "Basic " + Buffer.from(`${RABBITMQ_USER}:${RABBITMQ_PASS}`).toString("base64");
  const res = await fetch(url, { headers: { "Authorization": auth } });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
  return await res.json();
}

// --------------------
// Auxiliar fetch POST (para /get de mensagens)
// --------------------
async function postRabbitAPI(path, body) {
  const url = `${RABBITMQ_HOST}${path}`;
  const auth = "Basic " + Buffer.from(`${RABBITMQ_USER}:${RABBITMQ_PASS}`).toString("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": auth, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
  return await res.json();
}

// --------------------
// Listar Vhosts
// --------------------
async function listarVhosts() {
  const vhosts = await getRabbitAPI("/api/vhosts");
  console.log("\n📋 Vhosts:");
  vhosts.forEach(v => console.log(`- ${v.name}`));
}

// --------------------
// Listar Canais
// --------------------
async function listarCanais() {
  const canais = await getRabbitAPI("/api/channels");
  console.log("\n📋 Canais abertos:");
  canais.forEach(c => console.log(`- ${c.name} | Vhost: ${c.vhost} | Usuário: ${c.user}`));
}

// --------------------
// Listar Exchanges
// --------------------
async function listarExchanges() {
  const exchanges = await getRabbitAPI("/api/exchanges");
  console.log("\n📋 Exchanges:");
  exchanges.forEach(e => console.log(`- ${e.name} | Tipo: ${e.type} | Vhost: ${e.vhost}`));
}

// --------------------
// Listar Consumidores
// --------------------
async function listarConsumidores() {
  const consumers = await getRabbitAPI("/api/consumers");
  console.log("\n📋 Consumidores:");
  consumers.forEach(c => console.log(`- Queue: ${c.queue.name} | Vhost: ${c.queue.vhost} | Channel: ${c.channel_details.name}`));
}

// --------------------
// Listar Filas
// --------------------
async function listarFilas(vhost = "/") {
  const encodedVhost = encodeURIComponent(vhost);
  const filas = await getRabbitAPI(`/api/queues/${encodedVhost}`);
  return filas.map(f => ({
    nome: f.name,
    vhost: f.vhost,
    mensagensProntas: f.messages_ready,
    mensagensTotal: f.messages,
    consumidores: f.consumers,
    estado: f.state
  }));
}

// --------------------
// Pegar mensagens recentes de uma fila
// --------------------
async function pegarMensagens(vhost, queue) {
  const encodedVhost = encodeURIComponent(vhost);
  const encodedQueue = encodeURIComponent(queue);
  const body = { count: MENSAGENS_LIMITE, ackmode: "ack_requeue_true", encoding: "auto" };
  const mensagens = await postRabbitAPI(`/api/queues/${encodedVhost}/${encodedQueue}/get`, body);
  return mensagens.map(m => m.payload);
}

// --------------------
// Monitor contínuo de filas
// --------------------
async function monitorFilas(vhost = "/") {
  try {
    const filas = await listarFilas(vhost);
    console.log(`\n📋 Monitorando filas do vhost '${vhost}':`);
    filas.forEach(f => console.log(`- ${f.nome} | Mensagens prontas: ${f.mensagensProntas} | Total: ${f.mensagensTotal}`));

    const historico = {};
    filas.forEach(f => historico[f.nome] = new Set());

    setInterval(async () => {
      for (const f of filas) {
        const msgs = await pegarMensagens(vhost, f.nome);
        msgs.forEach(msg => {
          const key = JSON.stringify(msg);
          if (!historico[f.nome].has(key)) {
            console.log(`\n📩 [${f.nome}] Nova mensagem:`, msg);
            historico[f.nome].add(key);
          }
        });
      }
    }, POLL_INTERVAL);

  } catch (error) {
    console.error("Erro no monitor de filas:", error);
  }
}

// --------------------
// Executar tudo
// --------------------
async function main() {
  try {
    await listarVhosts();
    await listarCanais();
    await listarExchanges();
    await listarConsumidores();
    await monitorFilas("/");
  } catch (error) {
    console.error("Erro geral:", error);
  }
}

main();
