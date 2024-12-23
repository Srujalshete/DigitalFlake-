Digitalflake Job Hackathon Assignment

This project was built as part of the Digitalflake Job Hackathon 2024. The application uses React.js for the frontend and Node.js with Express.js for the backend. It integrates a MySQL database for data storage and features secure authentication with JWT.

Features
Responsive Design: Built using Tailwind CSS for seamless experience across devices.
User Authentication: Secure login and registration using JWT.
Data Management: Displays dynamic data using React Table.
Email Notifications: Integrated email service using Nodemailer.
State Management: Managed using local state within React components for simplicity and better performance in smaller applications, avoiding the overhead of Redux and Context API.


Tech Stack

Frontend
React.js (with Vite)
Tailwind CSS
React Table
Axios
React Router DOM

Backend

Node.js
Express.js
JWT - for authentication
Bcrypt - for password hashing
Nodemailer - for email functionality

Database
MySQL

Installation Guide
1. Prerequisites
Make sure you have the following installed on your system:

Node.js (v20 or later)
npm
MySQL


Clone the Repository

2. git clone <repository-url>
cd <repository-directory>

3. Backend Setup
Navigate to the backend directory:

cd backend
Install dependencies:- npm install

Import the Database:
~Locate the Digital.sql file in the SQLDB-File folder.
~Open phpMyAdmin or use the MySQL command line.
~Import the Digital.sql file into your MySQL database:
~In phpMyAdmin, go to the "Import" tab, select the Digital.sql file, and click "Go."

Or use the command line:
mysql -u root -p Digital < path/to/Digital.sql

4. Configure environment variables in the .env file in backend folder
DB_HOST=localhost //remain same
DB_USER=<your-db-username> // replace with actual db user name (eg. root)
DB_PASSWORD=<your-db-password> // replace with actual db pass (mostly it is " " blank)
DB_NAME=Digital     //remain same
DB_DIALECT=mysql   //remain same
DB_PORT=3306  //remain same
PORT=5000  //remain same app pass
JWT_SECRET=jwt13srujal   //if you want to change then you can
EMAIL_USER=<your-email>  //write your mail
APP_PASSWORD=<your-app-email-password> // write 16 digit App pass
Vite_APP_API_URL=http://localhost:5173
REACT_APP_API_URL=http://localhost:5000

Creating an App Password in Google
Enable 2-Step Verification:

Go to Google Account Security and enable 2-Step Verification if not already done.
Create an App Password:

In the Security section, under "App passwords", type a custom name(such as `Nodemailer`).
Click Generate to get a 16-character password.
Use the App Password:
Copy the generated password and use it as APP_PASSWORD in your .env file.


5. Start the development server:- 

npm run dev

backend server run on - http://localhost:5000



Frontend Setup
Clone the Repository:
Clone the project to your local machine:

git clone <repository-url>

Navigate to the Frontend Directory:
Go to the frontend directory: - cd frontend

Install Dependencies:
Run the following command to install all required dependencies: - npm install

Start the Development Server:
Run the following command to start the React development server: - npm run dev
The frontend will be available at http://localhost:5173