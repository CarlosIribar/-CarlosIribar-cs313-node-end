insert into accounts (Name, email, PASSWORD) values ('Carlos I', 'carlosi@gmail.com', 'pass');
insert into accounts (Name, email, PASSWORD) values ('German Perez', 'germanp@gmail.com', 'pass');


insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('Harry Potter and the Deathly Hallows', 'J. K. Rowling', '9780545010221', 1);

insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('Harry Potter and the Order of the Phoenix', 'J. K. Rowling', '9780439358064', 1);


insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('Jesus the Christ', 'James E. Talmage', '9781617209215', 2);


insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('LikeWar: The Weaponization of Social Media', 'P. W. Singer', '9781328695741', 1);


insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('Killing the Deep State: The Fight to Save President Trump', 'Jerome R. Corsi Ph.D.', '9781630061029', 1);

insert into 
books 
(Name, Author, ISBN, UserId) 
VALUES 
('Our Search for Happiness', 'M Russell Ballard', '9780875799179', 2);


-- Lecture Progress

INSERT INTO
LectureProgress
(StartDate, EndDate, BookId, UserId)
VALUES 
('2017-03-14', '2017-08-15', 8, 2);

INSERT INTO
LectureProgress
(StartDate, EndDate, BookId, UserId)
VALUES 
('2016-03-14', '2017-01-15', 9, 1);

INSERT INTO
LectureProgress
(StartDate, EndDate, BookId, UserId)
VALUES 
('2017-01-21', null, 10, 1);