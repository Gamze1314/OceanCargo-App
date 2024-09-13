# OceanCargo App

### Overview

This is Flask-based RESTful API of the Ocean Cargo App, a web application designed to manage ocean cargo shipments. The app allows user to view the vessel schedules and associated containers on the Home page. The API endpoints are designed by RESTful conventions to manage HTTP requests to add container for a specific shipment route, update a container type, and number, as well as deleting a container.

The app is configured to Flask-SQL Alchemy, Flask-Retful, and Flask-Migrate extensions to manage the database transactions. The API is designed based on RESTful conventions and JSON serialization.


### Features

- Container management (create, read, update, delete)
- Container and Shipment association
- RESTful API with serialized JSON response
- Database migrations with Flask-Migrate
- Google Map API Integration
- Container Search by container number


### Extensions and Backend Technologies Used

- Python 3.8.11
- Flask 
- Flsk-SQLAlchemy
- Flask-RESTful
- Flask-Migrate
- SQLite


### Project Structure 

├── app.py                 # Main application and API resource file

├── models.py              # Database models

├── migrations/            # Database migration files

├── seed.py                # Database seeding script. It contains scripts for populating fake data with Faker module.

├── instance/              # SQLite database instance

├── README.md              # Project documentation


### Installation

Clone the repository with <em>git clone "https://github.com/Gamze1314/OceanCargo-App"</em> command, and cd into OceanCargo-App directory.
You will need to create virtual environment and activate it with '<em>pipenv install</em> and '<em>pipenv shell</em>' commands respectively.


Install the required packages:

* pip install Flask
* pip install Flask-SQLAlchemy
* pip install Flask-RESTful
* pip install Flask-Migrate
* pip install ipdb
* pip install Faker


Set up the database:

* flask db init
* flask db migrate -m
* flask db upgrade

Run the application:

python app.py


### Configurations

The configuration settings are managed in the app.py such as the database URI, secret keys, and other Flask settings.

Setting Command Options

To set the port for the run command, instead of using below set up:

![alt text](image-2.png)

set the FLASK_RUN_PORT and FLASK_APP as shown below, and simply run flask run.

![alt text](image-3.png)

![alt text](image-4.png)


### API Endpoints 

- '/shipments' (GET): Gets all shipments.
- '/containers' (GET, POST): Manages new container creation and GET requests.
- '/container/<int:id>' (GET, PATCH, DELETE): Feches a container by id, delete and update.
- '/container/<string:container_number>' (GET): Fetches a container by container number.


### Frontend API Overview

The app utilizes React Context and the Fetch API for backend communication:

Fetch Shipments Data and Display on Home Page

Endpoint: /shipments
Method: GET
Purpose: Retrieve and set the list of shipments along with associated containers.


Add Container for the Selected Shipment

Endpoint: /containers
Method: POST
Purpose: Add a new container to a shipment.


Delete Container 

Endpoint: /containers/{containerId}
Method: DELETE
Purpose: Remove a container from a shipment.


Update Container

Endpoint: /containers/{containerId}
Method: PATCH
Purpose: Modify container details.


Search Container

Endpoint: /container/{containerNumber}
Method: GET
Purpose: Retrieve container details by container number.

Error Handling for all API calls: Alerts the user on failure and updates state upon success.


### Models

- Customer
- Shipment
- Container

### Flask-SQLAlchemy Relationships Set up


### Validation and Constraints

Customer Creation:

* Username: Must be 5-10 characters long and unique.
* Email: Must include an '@' symbol.
* Credit Amount: Must be a type of Numberic subclass, and greater than 20,000.
* Customr name : It can not be same as customer's username attribute.


Container Creation: 

* Container number: Must be unique, and a type of String containing 4 letters and 6 digits.
* Price : The container price is between 3500 and 10,000 in value, and has a hybrid property method to calculate total cost.


Shipment Creation:

* Constraint for arrival time: The arrival time can not be same as departure time.
* Freight rate: Must be a numberic with 2 floating point numbers.
* Status: Must be a string containing not more than 250 characters.


Origin and Arrival Ports: 
* Arrival and Destination Ports are re-selected/determined for 6 different arival and origin ports to display on Google Mapps. The coordinations are defined in data folder in src directorty for the purpose of Marker creation in the frontend.

### Development 

This project uses Flask's built-in development server. Debug mode is enabled for development purposes. The <strong>run</strong> command starts the development server.


![alt text](image-2.png)

### Contributing

Contributions are welcome! Please fork the repository and use a feature branch. 


