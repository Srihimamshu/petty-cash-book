## petty-cash-book

Petty Cash Book Web Application

The Petty Cash Book web application is designed to serve as a personalized app where users can record and analyze their financial transactions. This documentation provides an overview of the application, its structure, and the dependencies used during development.

Dependencies and Tools:

The following dependencies and tools were utilized during the development of the Petty Cash Book web application:

Node.js: A JavaScript runtime environment that allows server-side execution of JavaScript code.
Express.js: A web application framework for Node.js that simplifies the process of building web applications.
body-parser: A middleware for parsing incoming request bodies in a middleware chain.
dotenv: A module that loads environment variables from a .env file into process.env.
EJS (Embedded JavaScript): A templating language for generating HTML markup with JavaScript.
Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a higher-level abstraction for MongoDB operations.
MongoDB: A NoSQL database system used for storing and retrieving data.


Application Structure:
The Petty Cash Book web application is divided into three main segments:

1)  Landing Page:
This page serves as the entry point for users to navigate through the application.
It provides links to access the ledger page and analytics page.


2) Ledger Page:
This page allows users to insert transaction details into the database.
Users can enter information such as transaction date, description, amount, and category.
Upon submission, the data is stored in the MongoDB database using Mongoose.


3) Analytics Page:
This page provides users with a visual representation and analysis of their financial transactions.
Various charts and graphs can be generated based on the stored transaction data.
The analytics page utilizes data fetched from the MongoDB database.


![image](https://github.com/gnaaruag/petty-cash-book/assets/68043860/53f5140f-65a6-4286-ad38-6d6118ea4571)
![image](https://github.com/gnaaruag/petty-cash-book/assets/68043860/3f1a4d5f-d028-4a06-9d3e-9795a8ef13b0)
![image](https://github.com/gnaaruag/petty-cash-book/assets/68043860/a686ed0f-c0dd-42fa-b9bf-3e4d0223d20a)

deployed on [Render](https://petty-cash-app.onrender.com)
the deployment has a couple minor errors due to server date formats, but everything else works fine
