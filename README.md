# Introduction 

This repository contains the source code for a web application aimed at enhancing security and visitor management within residential estates. The application allows residents to generate access codes for visitors, monitors visitor access, and facilitates communication between security personnel and residents during emergencies. 

# Setup 

To run the application locally, follow these steps: 

Install Node.js and Docker Desktop on your computer. 

Clone this repository to your local machine. 

Navigate to the project directory in your terminal. 

Run npm install to install the required dependencies. 

Start the Docker containers by running docker-compose up . 

Access PHPMyAdmin at http://localhost:8081/ and log in with the provided credentials. 

Visit the Express app at http://localhost:3000. 

Run npm install express-sessions and npm install bcryptjs 

# File Structure 

/src: Contains the source code for the Node.js application. 

/routes: Contains route handlers for different application endpoints. 

/views: Contains Pug templates for rendering HTML pages. 

/models: Contains JavaScript files for interactive pages. 

app.js: Main entry point for the Express application. 

/docker: Contains Docker configuration files. 

.env-sample: Sample environment file for storing credentials. 

README.md: Documentation file providing instructions and information about the project. 

# Dependencies 

Express: Web framework for Node.js. 

Express Sessions: Middleware for managing user sessions. 

Bcrypt.js: Library for hashing passwords securely. 

MySQL2: MySQL client for Node.js. 

Dotenv: Package for reading environment variables. 

# Usage 

Log into the security interface using the provided credentials: 

Username: 123@gmail.com 

Password: [Hidden for security] 

Navigate through the application to explore its features and functionalities. 

Contributing 

Contributions to the project are welcome! If you encounter any issues or have suggestions for improvement, please open an issue or submit a pull request. 

License 

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code for your own purposes. 

 