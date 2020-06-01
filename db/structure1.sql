CREATE TABLE Book (
  Id   serial
  Title varchar(255) NOT NULL
  Description text NOT NULL
  Published date NOT NULL
  Price float(2) NOT NULL
)

CREATE TABLE Author (
  Id   serial
  AuthorName varchar(255) NOT NULL
  Address varchar(255) NOT NULL
  URL varchar(255) NULLABLE
)

CREATE TABLE Publisher (
  Id   serial
  PublisherName varchar(255) NOT NULL
  Address varchar(255) NOT NULL
  Phone varchar(64) NOT NULL
  URL varchar(255) NULLABLE
)

CREATE TABLE Customer (
  Id   serial
  FirstName varchar(64) NOT NULL
  SecondName varchar(64) NULLABLE
  Address varchar(255) NULLABLE
  Phone varchar(64) NULLABLE
)

CREATE TABLE CartOrder (
  Id   serial
  CreatedAt date NOT NULL
  ShippingAddress varchar(255) NULLABLE
)

CREATE TABLE OrderBook (
  BookId integer NOT NULL
  OrderId integer NOT NULL
)

CREATE TABLE Warehouse (
  Id   serial
  Code integer NOT NULL
)

CREATE TABLE WarehouseBook (
  WarehouseID integer NOT NULL
  BookId integer NOT NULL
)