CREATE TABLE Subscribers(
    id UUID PRIMARY KEY, 
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW() ,
);












