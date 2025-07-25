    -- Criar o banco de dados
    CREATE DATABASE IF NOT EXISTS achados_perdidos
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;

    -- Usar o banco de dados
    USE achados_perdidos;

    -- Criar a tabela de usuários
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      sobrenome VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      registro VARCHAR(10) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      termos_aceitos BOOLEAN NOT NULL DEFAULT FALSE,
      data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_registro (registro),
      INDEX idx_email (email)
    );

