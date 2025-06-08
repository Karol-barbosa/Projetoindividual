-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Tabela de salas
CREATE TABLE IF NOT EXISTS salas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  capacidade INTEGER NOT NULL
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  sala_id INTEGER REFERENCES salas(id),
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente'
);

INSERT INTO salas (id, nome, capacidade) VALUES (2, 'Sala de Estudos A', 10);

