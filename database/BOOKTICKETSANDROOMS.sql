﻿CREATE DATABASE Booking

GO

USE Booking

GO

CREATE TABLE ROLES(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	NAME NVARCHAR(50) NOT NULL
)

GO

CREATE TABLE USERS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	USERNAME VARCHAR(50) NOT NULL,
	PASSWORD NUMERIC NOT NULL,
	NAME NVARCHAR(50) NOT NULL,
	EMAIL VARCHAR(100) NOT NULL,
	NUMBERPHONE NUMERIC NOT NULL,
	BIRTHDAY DATE NOT NULL,
	ROLEID INT FOREIGN KEY (ROLEID) REFERENCES ROLES(ID) NOT NULL
)

GO

CREATE TABLE HOTELS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	NAME NVARCHAR(100) NOT NULL,
	NUNMBERPHONE NUMERIC NULL,
	EMAIL VARCHAR(100) NULL,
	ADDRESS NVARCHAR(200) NOT NULL	
)

GO

CREATE TABLE ROOMS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	NAME NVARCHAR(100) NOT NULL,
	PRICE FLOAT NOT NULL,
	HOTELID INT FOREIGN KEY (HOTELID) REFERENCES HOTELS(ID) NOT NULL
)

GO

CREATE TABLE AIRPORTS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	NAME NVARCHAR(100) NOT NULL,
	ADDRESS NVARCHAR(100) NOT NULL,
	NUMBERPHONE NUMERIC NULL
)

GO

CREATE TABLE TYPEOFCHAIRS(
	NAME NVARCHAR(30) PRIMARY KEY CHECK(NAME = 'Phổ thông' OR NAME = 'Phổ thông đặc biệt' OR NAME = 'Thượng gia'  OR NAME = 'Hạng nhất') NOT NULL,
	PRICE FLOAT NOT NULL
)

GO

--CREATE TABLE NUMBEROFPASSENGERS(
--	TYPEOFPEOPLE NVARCHAR(20) PRIMARY KEY CHECK(TYPEOFPEOPLE = 'NGƯỜI LỚN' OR TYPEOFPEOPLE = 'TRẺ EM' OR TYPEOFPEOPLE = 'EM BÉ') NOT NULL,
--	PRICE FLOAT NOT NULL
--)

--GO

CREATE TABLE FLIGHTS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	FROMLOCATION NVARCHAR(100) NOT NULL,
	TOLOCATION NVARCHAR(100) NOT NULL,
	NUMBEROFADULTS INT NULL,
	NUMBEROFCHILDREN INT NULL,
	NUMBEROFBABY INT NULL,
	DATEOFDEPARTMENT DATETIME NOT NULL,
	ROUNDTRIP CHAR(3) CHECK(ROUNDTRIP = 'YES' OR ROUNDTRIP = 'NO'),
	DATEROUNDTRIP DATETIME NULL,
	TYPEOFCHAIR VARCHAR(30) FOREIGN KEY (TYPEOFCHAIR) REFERENCES TYPEOFCHAIRS(NAME) NOT NULL,
	--CATEGORIES NVARCHAR(30) CHECK(CATEGORIES = 'Phổ thông' OR CATEGORIES = 'Phổ thông đặc biệt' OR CATEGORIES = 'Thượng gia' OR CATEGORIES = 'Hạng nhất'),
	AIRPORTID INT FOREIGN KEY (AIRPORTID) REFERENCES AIRPORTS(ID)
)

GO

CREATE TABLE BOOKINGROOMS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	USERID INT FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	HOTELID INT FOREIGN KEY (HOTELID) REFERENCES HOTELS(ID) NOT NULL,
	ROOMID INT FOREIGN KEY (ROOMID) REFERENCES ROOMS(ID) NOT NULL,
	PRICE FLOAT NOT NULL
)

GO

CREATE TABLE BOOKINGFLIGHTS(
	ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	USERID INT FOREIGN KEY (USERID) REFERENCES USERS(ID) NOT NULL,
	AIRPORTID INT FOREIGN KEY (AIRPORTID) REFERENCES AIRPORTS(ID) NOT NULL,
	FLIGHTID INT FOREIGN KEY (FLIGHTID) REFERENCES FLIGHTS(ID) NOT NULL,
	PRICE FLOAT NOT NULL
)