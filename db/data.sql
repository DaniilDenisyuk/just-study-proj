INSERT INTO Author (Name, Address) VALUES
  ('Frank Herbert', 'USA'),
  ('Andrzej Sapkowski', 'Poland'),
  ('George Martin', 'USA'),
  ('John Tolkien', 'England'),
  ('Paramahansa Yogananda', 'India'),
  ('Satyananda Saraswati', 'India');

INSERT INTO Publisher (Name, Address) VALUES
  ('Name1', 'Address1'),
  ('Name2', 'Address2'),
  ('Name3', 'Address3');

INSERT INTO Book (Title, published, AuthorId, PublisherId, Price) VALUES
  ('Witcher: The Last Wish',1993, 2, 1, 100.5),
  ('Witcher: Sword of Destiny',1992, 2, 1, 100.5),
  ('Witcher: Blood of Elves',1994, 2, 1, 100.5),
  ('Witcher: Time of Contempt',1995, 2, 1, 100.5),
  ('Witcher: Baptism of Fire',1996, 2, 1, 100.5),
  ('Witcher: The Tower of the Swallow',1997, 2, 1, 100.5),
  ('Witcher: The Lady of the Lake',1999, 2, 1, 100.5),
  ('Witcher: Season of Storms',2013, 2, 1, 150.0),
  ('Dune',1965, 1, 2, 150.0),
  ('Dune Messiah',1969, 1, 2, 100.0),
  ('Children of Dune',1976, 1, 2, 150.0),
  ('The Silmarillion',1977, 4, 3, 150.0),
  ('The Hobbit or There and back again',1937, 4, 3, 150.0),
  ('The Lord of the Rings: The Fellowship of the Ring',1954, 4, 3, 150.0),
  ('The Lord of the Rings: The Two Towers',1954, 4, 3, 150.0),
  ('The Lord of the Rings: The The Return of the King',1955, 4, 3, 150.0);

INSERT INTO Warehouse (Code) VALUES
  (123),
  (456),
  (789);

INSERT INTO WarehouseBook (WarehouseId, BookId) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (2, 9),
  (2, 10),
  (2, 11),
  (3, 12),
  (3, 13),
  (3, 14),
  (3, 15),
  (3, 16);



