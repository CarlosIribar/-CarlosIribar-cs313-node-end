

CREATE TABLE Accounts(
    Id          serial PRIMARY KEY,
    Name        varchar(120) NOT NULL,
    Email       varchar(60) NOT NULL,
    password     varchar(60) NOT NULL
);


CREATE TABLE books(
    Id          serial PRIMARY KEY,  
    Name        varchar(120) NOT NULL,
    Author      varchar(60) NOT NULL,
    ISBN        varchar(30),
    UserId      integer REFERENCES Accounts(Id)
);

CREATE TABLE LectureProgress(
    Id          serial PRIMARY KEY,
    StartDate   date NOT NULL,
    EndDate     date,
    BookId        integer REFERENCES books(Id),
    UserId        integer REFERENCES Accounts(Id)
);


-- DATABASE MODIFICATIONS
ALTER TABLE books
ADD Cover varchar(150);