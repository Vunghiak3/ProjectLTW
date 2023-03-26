﻿CREATE DATABASE BookingTicketsAndRooms

GO

USE BookingTicketsAndRooms

GO

CREATE TABLE ROLES(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
)

GO

CREATE TABLE USERS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Username VARCHAR(50) NOT NULL UNIQUE,
	Password VARCHAR(100) NOT NULL,
	PasswordAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	Email VARCHAR(100) NOT NULL UNIQUE,
	NumberPhone NUMERIC NOT NULL,
	Birthday DATE NOT NULL,
	RoleId INT CONSTRAINT FK_USERS_ROLES FOREIGN KEY (RoleId) REFERENCES ROLES(Id) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

CREATE TABLE HOTELS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(100) NOT NULL, -- Tên khách sạn
	NumberPhone NUMERIC NULL, -- Số điện thoại liên hệ
	Email VARCHAR(100) NULL, -- Email liên hệ
	Address NVARCHAR(200) NOT NULL, -- Địa chỉ khách sạn
)

GO

CREATE TABLE ROOMS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(100) NOT NULL, -- Tên phòng
	Price FLOAT NOT NULL, -- Giá phòng
	HotelId INT CONSTRAINT FK_ROOMS_HOTELS FOREIGN KEY (HotelId) REFERENCES HOTELS(Id) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

CREATE TABLE AIRPORTS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(100) NOT NULL, -- Tên sân bay
	Address NVARCHAR(100) NOT NULL, -- Địa chỉ sân bay
	NumberPhone NUMERIC NULL, -- Số điện thoại liên hệ
)

GO

CREATE TABLE AIRLINECLASS(
	Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	Name NVARCHAR(30) CHECK(NAME = 'Phổ thông' OR NAME = 'Phổ thông đặc biệt' OR NAME = 'Thượng gia'  OR NAME = 'Hạng nhất') NOT NULL, -- Hạng ghế
	Price FLOAT NOT NULL, -- Giá ghế
)

GO

CREATE TABLE FLIGHTS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	FromLocation NVARCHAR(100) NOT NULL, -- Nơi đi
	ToLocation NVARCHAR(100) NOT NULL, -- Nơi đến
	DateOfDepartment DATETIME NOT NULL, -- Ngày đi
	Roundtrip CHAR(5) CHECK(Roundtrip = 'TRUE' OR Roundtrip = 'FALSE'), -- Khứ hồi
	DateRoundtrip DATETIME NULL, -- Ngày khứ hồi
	NumberOfChairs INT NOT NULL, -- Số lượng ghế
	EmptySeat INT NOT NULL, -- Số lượng ghế trống 
	AirportId INT CONSTRAINT FK_FLIGHTS_AIRPORTS FOREIGN KEY (AirportId) REFERENCES AIRPORTS(Id),
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

CREATE TABLE SEATS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Type NVARCHAR(30) CONSTRAINT FK_SEATS_TYPEOFCHAIRS FOREIGN KEY (Type) REFERENCES AIRLINECLASS(Name) NOT NULL, -- Hạng ghế
	Status CHAR(5) CHECK(Status = 'TRUE' OR Status = 'FALSE') NOT NULL, -- Trạng thái ghế
	FlightId INT CONSTRAINT FK_SEATS_FLIGHTS FOREIGN KEY (FlightId) REFERENCES FLIGHTS(Id) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

CREATE TABLE BOOKINGROOMS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT CONSTRAINT FK_BOOKINGROOMS_USERS FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	HotelId INT CONSTRAINT FK_BOOKINGROOMS_HOTELS FOREIGN KEY (HOTELID) REFERENCES HOTELS(ID) NOT NULL,
	RoomId INT CONSTRAINT FK_BOOKINGROOMS_ROOMS FOREIGN KEY (ROOMID) REFERENCES ROOMS(ID) NOT NULL,
	Price FLOAT NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

CREATE TABLE BOOKINGFLIGHTS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT CONSTRAINT FK_BOOKINGFLIGHTS_USERS FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	AirportId INT CONSTRAINT FK_BOOKINGFLIGHTS_AIRPORTS FOREIGN KEY (AirportId) REFERENCES AIRPORTS(Id) NOT NULL,
	FlightId INT CONSTRAINT FK_BOOKINGFLIGHTS_FLIGHTS FOREIGN KEY (FlightId) REFERENCES FLIGHTS(Id) NOT NULL,
	SeatId INT CONSTRAINT FK_BOOKINGFLIGHTS_SEATS FOREIGN KEY (SeatId) REFERENCES SEATS(Id) NOT NULL,
	PRICE FLOAT NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

INSERT INTO ROLES(NAME) VALUES ('User'), ('Guide'), ('Lead-Guide'), ('Admin')

USE MASTER

DROP DATABASE Booking