CREATE DATABASE birthdayCamila;

USE birthdayCamila;

CREATE TABLE photos (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    imageUrl TEXT,
    englishDescription VARCHAR(70),
    portugueseDescription VARCHAR(70),
    photoType VARCHAR(10),
    approved BOOLEAN DEFAULT 0,
    highlightImage BOOLEAN DEFAULT 0
);

CREATE TABLE user (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email VARCHAR(70),
    accountPassword VARCHAR(150)
);

ALTER TABLE birthdayCamila.user ADD token varchar(32);
ALTER TABLE birthdayCamila.photos drop column photoType;
ALTER TABLE birthdayCamila.photos ADD imageName varchar(32);

SELECT * FROM birthdayCamila.user;
SELECT * FROM birthdayCamila.photos;