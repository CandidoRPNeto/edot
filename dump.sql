-- RODE CADA QUERY INDIVIDUALMENTE 

-- ETAPA 1: Criando o banco (Opcional caso o banco ja esteja criado)
CREATE DATABASE meubanco;

-- ETAPA 2: Selecionando o banco
USE meubanco;

-- ETAPA 3: Criando as tabelas (Ps: talvez seja necessario rodar uma por uma)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(3) NOT NULL
);

CREATE TABLE classrooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    birth_date DATE NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    classroom_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
);

-- ETAPA 4: Inserindo o admin

INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Carla Admin', 'carla.admin@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'ADM');

-- ETAPA 5: Semeando as tabelas (Apenas se quiser dados pre cadasrados para facilitar os testes)

INSERT INTO users (id,name, email, password, role) VALUES
(2, 'Ana Souza', 'ana@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(3, 'Bruno Lima', 'bruno@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(4, 'Carlos Silva', 'carlos@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(5, 'Daniela Santos', 'daniela@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(6, 'Eduardo Oliveira', 'eduardo@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(7, 'Fernanda Costa', 'fernanda@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(8, 'Gabriel Pereira', 'gabriel@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(9, 'Helena Rodrigues', 'helena@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(10, 'Igor Almeida', 'igor@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(11, 'Julia Ferreira', 'julia@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(12, 'Leandro Martins', 'leandro@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(13, 'Mariana Gomes', 'mariana@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(14, 'Nelson Cardoso', 'nelson@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(15, 'Olivia Ribeiro', 'olivia@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(16, 'Paulo Mendes', 'paulo@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(17, 'Quiteria Barbosa', 'quiteria@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD'),
(18, 'Rafael Sousa', 'rafael@example.com', '$2y$10$X.ZW6TXCMoUH7pnE1UOD2e3brtK32N9Fhi7kJc6MpLjvz4AdP8hS6', 'STD');

INSERT INTO classrooms (id, name, description) VALUES
(1, 'Cauculo 1', 'Primeira materia de cauculo do curso'),
(2, 'Logica de programação e algoritimos', 'Primeira materia de programação do curso');

INSERT INTO students (birth_date, cpf, user_id) VALUES
('2005-05-10', '12345678900', 1),
('2004-11-22', '98765432100', 2),
('2003-07-15', '11122233344', 4),
('2002-03-21', '22233344455', 5),
('2004-12-10', '33344455566', 6),
('2001-08-05', '44455566677', 7),
('2005-01-30', '55566677788', 8),
('2000-09-18', '66677788899', 9),
('2002-05-27', '77788899900', 10),
('2003-11-12', '88899900011', 11),
('2004-04-08', '99900011122', 12),
('2001-10-23', '00011122233', 13),
('2003-02-14', '11222333445', 14),
('2005-06-19', '22333444556', 15),
('2002-08-31', '33444555667', 16),
('2000-12-26', '44555666778', 17),
('2004-09-03', '55666777889', 18);

INSERT INTO enrollments (id, student_id, classroom_id) VALUES
(1, 1, 1),
(2, 2, 2);