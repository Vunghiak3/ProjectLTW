﻿CREATE DATABASE BookingTicketsAndRooms

GO

USE BookingTicketsAndRooms

GO

CREATE TABLE ROLES(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
)
-- ('user'), ('hotelManager'), ('flightManager'), ('admin')

GO

CREATE TABLE USERS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Username VARCHAR(50) NOT NULL UNIQUE,
	Password VARCHAR(100) NOT NULL,
	PasswordAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	Email VARCHAR(100) NOT NULL UNIQUE,
	PhoneNumber NVARCHAR(20) NOT NULL,
	Birthday DATE NOT NULL,
	RoleId INT CONSTRAINT FK_USERS_ROLES FOREIGN KEY (RoleId) REFERENCES ROLES(Id) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

INSERT INTO USERS(Username, Password, Name, Email, PhoneNumber, Birthday, RoleId) VALUES
('Admin', '123456', 'Nguyen Van A', 'Admin01@gmail.com', '0983923839', '4/23/1995', 4),
('HotelManager', '123456', 'Nguyen Van B', 'HotelManager01@gmail.com', '0937463854', '9/12/1994', 2),
('FlightManager', '123456', 'Nguyen Van C', 'FlightManager01@gmail.com', '09384756122', '1/1/1996', 3),
('User', '123456', 'Nguyen Van D', 'User01@gmail.com', '0974564123', '2/3/2000', 1)

GO

CREATE TABLE HOTELS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(100) NOT NULL, -- Tên khách sạn
	PhoneNumber NVARCHAR(20) NULL, -- Số điện thoại liên hệ
	Email VARCHAR(100) NULL UNIQUE, -- Email liên hệ
	Address NVARCHAR(200) NOT NULL, -- Địa chỉ khách sạn
	City NVARCHAR(200) NOT NULL,
	EmtyRooms INT DEFAULT 0 NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

INSERT INTO HOTELS(Name, PhoneNumber, Email, Address, City) VALUES
('Hotel 01', '0928374832', 'Hotel01@gmail.com', 'HCM', 'HCM'),
('Hotel 02', '0823465789', 'Hotel02@gmail.com', 'HN', 'HN'),
('Hotel 03', '0283728145', 'Hotel03@gmail.com', 'DN', 'DN')

GO

CREATE TABLE ROOMS(
	Id INT IDENTITY(1,1) NOT NULL,
	PRIMARY KEY(Id, HotelId),
	Name NVARCHAR(100) NOT NULL, -- Tên phòng
	Price FLOAT NOT NULL, -- Giá phòng
	HotelId INT CONSTRAINT FK_ROOMS_HOTELS FOREIGN KEY (HotelId) REFERENCES HOTELS(Id) NOT NULL,
	Status CHAR(5) CHECK(Status = 'TRUE' OR Status = 'FALSE') DEFAULT 'TRUE' NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

--insert hotel01
INSERT INTO ROOMS(Name, Price, HotelId) VALUES
('H01P01', 300, 1),
('H01P02', 200, 1),
('H01P03', 300, 1),
('H01P04', 800, 1),
('H01P05', 500, 1)
GO

--insert hotel02
INSERT INTO ROOMS(Name, Price, HotelId) VALUES
('H02P01', 1000, 2),
('H02P02', 900, 2),
('H02P03', 550, 2),
('H02P04', 1100, 2),
('H02P05', 800, 2)
GO

--insert hotel03
INSERT INTO ROOMS(Name, Price, HotelId) VALUES
('H03P01', 1000, 3),
('H03P02', 1000, 3),
('H03P03', 1000, 3),
('H03P04', 1000, 3),
('H03P05', 1000, 3)

GO

CREATE TABLE AIRPORTS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(100) NOT NULL, -- Tên sân bay
	Address NVARCHAR(100) NOT NULL, -- Địa chỉ sân bay
	PhoneNumber NVARCHAR(20) NULL, -- Số điện thoại liên hệ
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
)

GO

INSERT INTO AIRPORTS(Name, Address, PhoneNumber) VALUES
('Tan Son Nhat', 'HCM', '0928743646'),
('Noi Bai', 'HN', '0792832744')

GO

CREATE TABLE AIRLINECLASS(
	Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	Name NVARCHAR(30) NOT NULL, -- Hạng ghế
	Price FLOAT NOT NULL, -- Giá ghế
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
)

GO

INSERT INTO AIRLINECLASS(Name, Price) VALUES
('Pho thong', 1000),
('Pho thong dac biet', 2000),
('Thuong gia', 3000),
('Hang nhat', 4000)

GO

CREATE TABLE FLIGHTS(
	Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	Name VARCHAR(50),
	FromLocation NVARCHAR(100) NOT NULL, -- Nơi đi
	ToLocation NVARCHAR(100) NOT NULL, -- Nơi đến
	DateOfDepartment DATETIME NOT NULL, -- Ngày đi
	EmptySeat INT NULL, -- Số lượng ghế trống 
	AirportId INT CONSTRAINT FK_FLIGHTS_AIRPORTS FOREIGN KEY (AirportId) REFERENCES AIRPORTS(Id),
	CreateAt DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
)	

GO

INSERT INTO FLIGHTS(Name, FromLocation, ToLocation, DateOfDepartment, AirportId) VALUES
('Flight 01', 'HCM', 'HN', '5/20/2023', '1'),
('Flight 02', 'HCM', 'BMT', '5/23/2023', '1'),
('Flight 03', 'HN', 'HN', '5/11/2023', '2'),
('Flight 04', 'HN', 'BMT', '5/2/2023', '2')


GO

CREATE TABLE SEATS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	name varchar(10),
	AirlineClassId INT FOREIGN KEY (AirlineClassId) REFERENCES AIRLINECLASS(Id) NOT NULL, -- Hạng ghế
	Status CHAR(5) CHECK(Status = 'TRUE' OR Status = 'FALSE') DEFAULT 'TRUE' NOT NULL, -- Trạng thái ghế
	FlightId INT  FOREIGN KEY (FlightId) REFERENCES FLIGHTS(Id) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
)

GO

--insert flight01
INSERT INTO SEATS(name, AirlineClassId, FlightId) VALUES
('S01', 1, 1),
('S02', 1, 1),
('S03', 1, 1),
('S04', 1, 1),
('S05', 2, 1),
('S06', 2, 1),
('S07', 2, 1),
('S08', 3, 1),
('S09', 3, 1),
('S10', 4, 1)
GO

--insert flight02
INSERT INTO SEATS(name, AirlineClassId, FlightId) VALUES
('S01', 1, 2),
('S02', 1, 2),
('S03', 1, 2),
('S04', 1, 2),
('S05', 2, 2),
('S06', 2, 2),
('S07', 2, 2),
('S08', 3, 2),
('S09', 3, 2),
('S10', 4, 2)
GO

--insert flight03
INSERT INTO SEATS(name, AirlineClassId, FlightId) VALUES
('S01', 1, 3),
('S02', 1, 3),
('S03', 1, 3),
('S04', 1, 3),
('S05', 2, 3),
('S06', 2, 3),
('S07', 2, 3),
('S08', 3, 3),
('S09', 3, 3),
('S10', 4, 3)
GO

--insert flight04
INSERT INTO SEATS(name, AirlineClassId, FlightId) VALUES
('S01', 1, 4),
('S02', 1, 4),
('S03', 1, 4),
('S04', 1, 4),
('S05', 2, 4),
('S06', 2, 4),
('S07', 2, 4),
('S08', 3, 4),
('S09', 3, 4),
('S10', 4, 4)
GO


GO

CREATE TABLE BOOKINGROOMS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT CONSTRAINT FK_BOOKINGROOMS_USERS FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	HotelId INT NOT NULL,
	RoomId INT NOT NULL,
	CONSTRAINT FK_BOOKINGROOMS_ROOMS FOREIGN KEY (RoomId, HotelId) REFERENCES ROOMS(Id, HotelId),
	Price FLOAT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CheckInDate DATE NOT NULL,
	NumberDay INT NOT NULL,
	CheckOutDate DATE NULL,
	Status NVARCHAR(50) NOT NULL, 
)

GO

CREATE TABLE BOOKINGFLIGHTS(
	Id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	UserId INT CONSTRAINT FK_BOOKINGFLIGHTS_USERS FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	FlightId INT FOREIGN KEY (FlightId) REFERENCES FLIGHTS(Id) NOT NULL,
	SeatId INT CONSTRAINT FK_BOOKINGFLIGHTS_SEATS FOREIGN KEY (SeatId) REFERENCES SEATS(Id) NOT NULL,
	Status NVARCHAR(50) NOT NULL,
	CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
)

GO

--AUTO UPDATE SEATS
CREATE TRIGGER seatUpdate ON BOOKINGFLIGHTS AFTER INSERT AS
BEGIN
	UPDATE FLIGHTS
	SET EmptySeat = EmptySeat - 1
	FROM FLIGHTS
	JOIN inserted ON FLIGHTS.Id = inserted.FlightId
END;
GO
--AUTO UPDATE SEATS STATUS 
CREATE TRIGGER seatStatus ON BOOKINGFLIGHTS AFTER INSERT AS
BEGIN
	UPDATE SEATS
	SET Status = 'FALSE'
	FROM SEATS
	JOIN inserted ON SEATS.id = inserted.SeatId
END;
GO
--AUTO RETURN SEAT STATUS
CREATE TRIGGER seatStatusUpdate ON BOOKINGFLIGHTS AFTER UPDATE AS
BEGIN
	UPDATE SEATS
	SET Status = 'TRUE'
	FROM SEATS
	JOIN BOOKINGFLIGHTS ON SEATS.id = BOOKINGFLIGHTS.SeatId
	WHERE BOOKINGFLIGHTS.Status = 'Cancel'
END;
GO

--ADD ALL SEAT BY FLIGHT ID

DECLARE @step INT = 1,
@seats INT = (SELECT EmptySeat from Flights where id = 2)
WHILE @step <= @seats
begin 
	if(@step <= 10)
		begin
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('A'+CONVERT(varchar,@step),2,'TRUE',2)
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('B'+CONVERT(varchar,@step),2,'TRUE',2)
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('C'+CONVERT(varchar,@step),2,'TRUE',2)
		end
	else
		begin
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('A'+CONVERT(varchar,@step),12,'TRUE',2)
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('B'+CONVERT(varchar,@step),12,'TRUE',2)
			Insert into SEATS (Name, AirlineClassId, Status,FlightId) values ('C'+CONVERT(varchar,@step),12,'TRUE',2)
		end
set @step = @step +1
end;

CREATE TRIGGER trg_UpdateCheckOutDate
ON BOOKINGROOMS
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE BOOKINGROOMS
    SET CheckOutDate = DATEADD(day, NumberDay, CheckInDate)
    FROM BOOKINGROOMS
    WHERE BOOKINGROOMS.Id IN (SELECT Id FROM inserted)
END;

--AUTO UPDATE ROOM 
-- CREATE TRIGGER roomUpdate ON BOOKINGROOMS AFTER INSERT AS 
-- BEGIN
-- 	UPDATE HOTELS
-- 	SET EmtyRooms = EmtyRooms -1
-- 	From HOTELS
-- 	JOIN inserted ON HOTELS.Id = inserted.HotelId
-- END;
--GO

--CREATE TRIGGER roomStatus ON BOOKINGROOMS AFTER INSERT AS 
--BEGIN
--	UPDATE ROOMS
--	SET Status = 'FALSE'
--	From ROOMS
--	JOIN inserted ON ROOMS.Id = inserted.RoomId
--END;
--GO


/*ROOMS*/

-- CREATE TRIGGER roomInsert ON ROOMS AFTER INSERT AS
-- BEGIN
-- 	UPDATE HOTELS
-- 	SET EmtyRooms = EmtyRooms + 1
-- 	FROM HOTELS
-- 	JOIN inserted ON HOTELS.Id = inserted.HotelId
-- END;
--GO

-- CREATE TRIGGER trg_UpdatePrice
-- ON BOOKINGROOMS
-- AFTER INSERT, UPDATE
-- AS
-- BEGIN
--     UPDATE BOOKINGROOMS
--     SET Price = ROOMS.Price * BOOKINGROOMS.NumberDay
--     FROM BOOKINGROOMS
--     INNER JOIN ROOMS ON BOOKINGROOMS.RoomId = ROOMS.Id
--     WHERE BOOKINGROOMS.Id IN (SELECT Id FROM inserted)
-- END;
-- GO




--drop database BookingTicketsAndRooms

/*INSERT INTO ROLES(Name) VALUES ('user'), ('hotelManager'), ('filghtManager'), ('admin')
USE MASTER
DROP DATABASE Booking*/

/*
select * from FLIGHTS
update SEATS set Status = 'TRUE'
SELECT * FROM SEATS WHERE Status = 'TRUE' AND Id = 4
*/

--use master

--select * from BOOKINGFLIGHTS where UserId = 1
--select * from SEATS
--select * from AIRLINECLASS

--SELECT bf.*, ac.name, ap.name
--FROM BOOKINGFLIGHTS bf
--JOIN SEATS s ON bf.SeatId = s.id
--JOIN AIRLINECLASS ac ON s.AirlineClassId = ac.id
--JOIN FLIGHTS f ON bf.FlightId = f.id
--JOIN AIRPORTS ap ON f.AirportId = ap.id
--WHERE bf.UserId = 1


--INSERT INTO SEATS (name,AirlineClassId,Status,FlightId) VALUES ('A-001','2','TRUE','1')
--ALTER TABLE FLIGHTS ALTER COLUMN DateOfDepartment DATE
--delete from FLIGHTS

--Insert into FLIGHTS(Name,FromLocation,ToLocation,DateOfDepartment,EmptySeat,AirportId, CreateAt) values('Air-001','BMT','HCM','2023-05-23',201,1,'2020-05-22'),
--('Air-002','HCM','HN','2023-05-23',201,1,'2020-05-22')
--INSERT INTO ROLES(Name) VALUES('user'),('hotelmanager'),('flightmanager'),('admin')
--Insert into Airports (name, address,phonenumber) values('VietJet', 'VN', '0000')

--if EXISTS( select * from SEATS WHERE Id = 15 and Status = 'TRUE')
--print('ok')

--SELECT * FROM FLIGHTS
--select Id, name from FLIGHTS
--SELECT * FROM BOOKINGFLIGHTS

--select * From SEATS where AirlineClassId = 2
--DELETE From BOOKINGFLIGHTS Where SeatId in (Select id from SEATS where AirlineClassId = 2)
--SELECT * FROM AIRLINECLASS

----check booking
--Select * From BOOKINGFLIGHTS Where SeatId in (Select id from SEATS where AirlineClassId = 2)
----check seat
--select * From SEATS where AirlineClassId = 2