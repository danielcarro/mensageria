# Sistema de Pedidos com RabbitMQ e PHP

Este projeto implementa um sistema de pedidos usando **PHP**, **RabbitMQ** e **SQLite**, com uma interface simples em **HTML/Bootstrap**. O sistema envia mensagens para filas RabbitMQ e processa essas mensagens para atualizar o status de pedidos no banco de dados.

---

## Tecnologias utilizadas

- PHP 8.x
- RabbitMQ
- SQLite
- Bootstrap 5
- Composer
- PhpAmqpLib

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto

Instale as dependências com Composer:
composer install


Configure o RabbitMQ (via Docker recomendado):
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

Verifique se o banco de dados SQLite existe em db/pedidos.db. Caso não exista, crie a tabela Pedidos

CREATE TABLE Pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produtos TEXT,
  email INTEGER DEFAULT 0,
  distributor INTEGER DEFAULT 0,
  payment INTEGER DEFAULT 0
);


Como usar
Interface web

Abra o arquivo public/index.html no navegador.
Você poderá:

Inserir novos pedidos.

Visualizar o status dos pedidos em tempo real (atualização a cada 7 segundos).

Scripts PHP

store pedido: envia o pedido para o RabbitMQ e persiste no banco.

consumers: três scripts separados para processar as filas RabbitMQ:

receivePedido.php → Atualiza payment

receiveDistributor.php → Atualiza distributor

receiveEmail.php → Atualiza email

Executar cada consumer via terminal:

php receivePedido.php
php receiveDistributor.php
php receiveEmail.php


Configuração RabbitMQ

Host: 127.0.0.1

Porta: 5672

Usuário: guest

Senha: guest

As filas usadas são:

pedido_exchange (tipo fanout)

payment_queue

distributor_queue

email_queue

Observações

Mensagens são persistentes (delivery_mode = 2) para garantir confiabilidade.

O front-end usa AJAX para interagir com a API PHP.

O sistema foi testado em Windows e Docker para RabbitMQ.

Licença

MIT License


---


