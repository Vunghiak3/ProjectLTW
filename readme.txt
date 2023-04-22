#init project
npm init

#install nodemon
npm install nodemon --save-dev

#install express version 4
npm install express@4

#run application with nodemon
npm run start:dev

#install morgan
npm install morgan

#reading environment variables with dotenv
npm install dotenv


#install tedious
npm install tedious
#using mssql as wrapper of tedious
npm install mssql

#install bcryptjs
npm install bcryptjs

#install JsonWebToken
npm install jsonwebtoken

#import database
cd C:\Program Files\Microsoft SQL Server\160\DAC\bin\SqlPackage.exe

/a:Import /sf:D:\Project\git-project\database\BookingTicketsAndRooms.bacpac /tsn:Server-Name /tdn:Database-Name /tu:UserName /tp:Password /p:TrustServerCertificate=True /p:CommandTimeout=1200 /TargetEncryptConnection:False