# OceanCargo React Frontend

### Overview

The OceanCargo app is SPA designed for managing shipments and customer information. This React-based frontend interacts with Flask-based backend to provide users functionalities such as booking shipments, viewing shipment schedules, managing their profiles.

### Features

- User Authentication: Sign up, log in, and log out functionality for customer.
- Ocean Shipment Booking: Customers can book shipments, view their bookings nd remaining credit amount on dashboard personalized to each customer.
- User Profile Management: Customer can update their account information.
- Responsive Design: The application is designed to be responsive and works on various screen sizes.

### Project Structure 

OceanCargo-App-client/

├── src/

│   │   ├── NavBar.js          # Navigation bar component

│   │   ├── Login.js           # Login component

│   │   ├── SignUp.js          # Sign up component

│   │   ├── Shipments.js       # Component to display all shipments

│   │   ├── UserProfile.js      # Profile management component

│   │   ├── NewBookingForm.js     # Shipment booking form

│   ├── assets/

│   │   └── logo.jpg           # Logo image used in NavBar

│   │   └── img1.jpg           # Container image used in Home Page

│   │   └── img2.jpg           # Second Container image used in Home Page

│   ├── index.css              # Global CSS styles

│   ├── App.js                 # Main App component

│   ├── index.js               # Entry point of the application

├── public/

│   └── index.html             # HTML template

├── package.json               # Node.js dependencies and scripts

├── README.md                  # Project documentation

└── tailwind.config.js          # Tailwind CSS configuration and plugins


### Set up and Installations

Download Node.js to utilize runtime environment for this project. Link: [nodejs.org.](https://nodejs.org/en) 

- git clone https://github.com/Gamze1314/OceanCargo-App 
- cd into client directory
- npm install 
- In the project directory, you can run: npm start

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in your browser. 'package.json' file contains 'start' script with PORT=4000 configuration and proxy set up for the backend communication for 'http://127.0.0.1:5555' which allows the cross-origin resource sharing.

![alt text](image.png)


Proxy:

![alt text](image-1.png)

### Front-end Technologies Used

- JavaScript
- React.js
- React-router-dom
- Tailwind CSS
- Formik
- Yup


### Routes and Router Configuration

The routing is managed using 'react-router-dom' , which allows dynamic and nested routing. The router is created using 'createBrowserRouter' function defining all routes that application supports.
Based on the URL path defined components will be rendered.

- Top-level router structure starts with the path '/', renders the App component as the root element.
- The App components will render different children componenets based on the routes plugging in with 'Outlet' in the app.js file. Check out /client/routes.js path.
- ErrorElement is specified to handle the cases where route patch is invalid or an error occurs during the programmatic navigation.


![alt text](image-2.png)



### Components

Index.js


App.js





### API Interaction


### Contributions

