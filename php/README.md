# Sistema de Pedidos Distribuído com RabbitMQ

## 🚀 Visão Geral do Sistema

Este projeto implementa uma **arquitetura distribuída** para processamento de pedidos, utilizando:

- **Frontend**: Interface web responsiva (Bootstrap 5)
- **Backend**: API PHP para gestão de pedidos
- **Message Broker**: RabbitMQ para comunicação assíncrona
- **Banco de Dados**: SQLite para persistência

## 🛠️ Tecnologias Principais

| Componente       | Tecnologia          | Versão   |
|------------------|---------------------|----------|
| Linguagem        | PHP                 | 8.x      |
| Message Broker   | RabbitMQ            | 3.8+     |
| Banco de Dados   | SQLite              | 3.x      |
| Frontend         | Bootstrap           | 5.x      |
| Biblioteca AMQP  | PhpAmqpLib          | 2.12+    |

## 📥 Instalação e Configuração

### Pré-requisitos
```bash
# Instale o Docker e Docker Compose
sudo apt-get install docker.io docker-compose
```

### 1. Inicie a Infraestrutura
```bash
docker-compose up -d
```

### 2. Configure o Projeto
```bash
git clone https://github.com/seu-usuario/sistema-pedidos.git
cd sistema-pedidos

# Instale dependências
composer install

# Crie o banco de dados
sqlite3 db/pedidos.db < db/schema.sql
```

### 3. Permissões
```bash
chmod -R 777 db/
chmod +x workers/*
```

## 🏗️ Estrutura do Projeto

```
sistema-pedidos/
├── public/               # Frontend
│   ├── index.html        # Interface principal
│   └── assets/           # CSS/JS
├── src/                  # Lógica de negócio
│   ├── Pedido.php        # Modelo de pedido
│   ├── RabbitMQ.php      # Cliente de mensageria
│   └── Database.php      # Acesso ao banco
├── workers/              # Consumers
│   ├── payment.php       # Processa pagamentos
│   ├── distributor.php   # Gerencia distribuição
│   └── email.php         # Envia notificações
├── db/                   # Banco de dados
│   └── pedidos.db        # Arquivo SQLite
└── docker-compose.yml    # Configuração Docker
```

## 🔄 Fluxo de Mensagens

1. **Frontend** → `POST /pedidos` → **API PHP**
2. **API PHP** → Persiste no SQLite → Publica no RabbitMQ
3. **Workers** consomem das filas:
   - `payment_queue`: Processa pagamentos
   - `distributor_queue`: Gerencia estoque
   - `email_queue`: Envia confirmações

## 🚦 Como Executar

### Inicie os Workers
```bash
php workers/payment.php &
php workers/distributor.php &
php workers/email.php &
```

### Acesse a Interface
```bash
php -S localhost:8000 -t public
```
Acesse: http://localhost:8000

## ⚙️ Configuração RabbitMQ

| Parâmetro       | Valor        |
|-----------------|-------------|
| Host            | 127.0.0.1   |
| Porta           | 5672        |
| Usuário         | guest       |
| Senha           | guest       |
| Exchange        | pedido_exchange (fanout) |
| Filas           | payment_queue, distributor_queue, email_queue |

## 📊 Monitoramento

Acesse o painel do RabbitMQ:
```
http://localhost:15672
usuário: guest
senha: guest
```

## 🛡️ Considerações de Segurança

- Todas as mensagens são persistentes (`delivery_mode = 2`)
- Validação de entrada no backend PHP
- Transações no banco de dados SQLite
- Workers com tratamento de erros e retry automático

## 📜 Licença

MIT License - Consulte o arquivo [LICENSE](LICENSE) para detalhes.

