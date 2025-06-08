CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    numero_sala VARCHAR(10) NOT NULL UNIQUE,
    capacidade INT
);

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    sala_id INT NOT NULL,
    data_checkin TIMESTAMP NOT NULL,
    data_checkout TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmada',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (sala_id) REFERENCES salas(id),

    CONSTRAINT chk_checkout_after_checkin CHECK (data_checkout > data_checkin),
    EXCLUDE USING gist (
        sala_id WITH =,
        tsrange(data_checkin, data_checkout) WITH &&
    )
);

INSERT INTO salas (numero_sala, capacidade) VALUES
('A01', 10), ('A02', 10), ('A03', 10), ('A04', 10), ('A05', 10),
('A06', 15), ('A07', 15), ('A08', 20), ('A09', 20), ('A10', 5);
