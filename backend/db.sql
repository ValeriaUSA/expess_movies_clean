-- need to install : npm i mysql2
CREATE DATABASE express_movies;
use express_movies;


CREATE TABLE films (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(30) UNIQUE,
    image VARCHAR(30),
    description TEXT,
    dateSortie DATETIME,
    genre VARCHAR(30)
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ABONNE') NOT NULL DEFAULT 'ABONNE'
);

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    film_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE, 
    UNIQUE(user_id, film_id) -- no duplicates
);

-- INERT into Tables


-- Drop Table films;

INSERT INTO films
VALUES (
    NULL,
    "Pauvres Creatures",
    "images/creatures.png",
    "Very good movie",
    '2024-01-01',
    "drama"
);

INSERT INTO films (titre, image, description, dateSortie, genre) VALUES
("The Last Horizon", "images/horizon.png", "An epic sci-fi journey to the edge of the galaxy.", '2023-05-15', "science-fiction"),
("Midnight Echo", "images/midnight.png", "A mysterious thriller set in a quiet coastal town.", '2022-11-03', "thriller"),
("Golden Harvest", "images/harvest.png", "A heartfelt drama about family, tradition, and change.", '2021-09-20', "drama");

public/images/belles_annees.png public/images/creatures.png public/images/horizon.png public/images/logo.png public/images/midnight-echo-18.jpg public/images/zone.png