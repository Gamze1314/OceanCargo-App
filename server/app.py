from flask import Flask, make_response, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
# import models
from models import db, Shipment, Container, Customer, ShipmentContainerAssociation
import ipdb

# create a Flask application object
app = Flask(__name__)

# set secret key to use session, to generate/change a secret key: run in terminal; python -c 'immport os; print('os.urandom(16))'.
# <SecureCookieSession {'test': 'testing 123'}>
app.secret_key = b'\x86\xa8\xc1)\xc42\xdd\x15s\x81\x86\xc1\x18\x99B\xea'

# configure a database connection to the local file app.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

# disable modification tracking to use less memory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# create a Migrate object to manage schema modifications
migrate = Migrate(app, db)

# # initialize the Flask application to use the database
db.init_app(app)

api = Api(app)


class Login(Resource):

    def get(self):
        pass

    def post(self):
        # request.json => username, we can search the customer by their username
        # POST request to login the user. we need to access the session.
        data = request.json.get('username')
        customer = Customer.query.filter(Customer.username == data).first()
        if customer:
            # if customer is found, store id the id in the session, and return 201 if successful.
            # keep them logged in with session ; customer.id => unique
            session['customer_id'] = customer.id
            # session.get('customer_id')
            # cookie is saved in the browser.
            # ipdb.set_trace()
            response_body = customer.to_dict()
            return make_response(response_body, 201)
        else:
            # if customer is not found, return if not found.
            return make_response({'error': 'Invalid username'}, 401)


api.add_resource(Login, '/login')

# handle login
# if customer logged in , show the contents to book the shipments, if not, redirect them to log in page.

# Resource : check_session => browser can save cookies thru proxy, keeps them logged in. when user logged in, remembers the username.


class CheckSession(Resource):

    def get(self):
        # ipdb.set_trace()
        # Check if a customer ID is present in the session
        customer = db.session.get(Customer, session.get('customer_id'))
        if customer:
            # Return the customer information. and its shipments.
            response_body = customer.to_dict()
            return make_response(response_body, 200)
        else:
            # Return a 401 Unauthorized response if no customer ID is found
            return make_response({'error': 'Please log in'}, 401)


api.add_resource(CheckSession, '/check_session')


class LogOut(Resource):

    def delete(self):
        # Clear the session if user logs out.(delete the cookie)
        if session.get('customer_id'):
            del (session['customer_id'])

        response_body = {}
        return make_response(response_body, 204)


api.add_resource(LogOut, '/logout')


class Shipments(Resource):

    def get(self):
        try:
            # Fetch all shipments from the database
            shipments = Shipment.query.all()

            # Check if shipments are found
            if shipments:
                # Convert each shipment to a dictionary and prepare the response body
                response_body = [shipment.to_dict() for shipment in shipments]
                return make_response(response_body, 200)
            else:
                return make_response({'message': 'No shipments found'}, 404)

        except Exception as e:
            # Handle any unexpected errors
            return {'message': f'Error fetching shipments: {e}'}, 500


api.add_resource(Shipments, '/shipments')

# Endpoint to get shipments by customer ID


class ShipmentsByCustomer(Resource):

    def get(self, customer_id):
        try:
            # Fetch all shipments associated with the given customer ID
            shipments = Shipment.query.filter_by(customer_id=customer_id).all()

            # Check if shipments are found
            if shipments:
                # Convert each shipment to a dictionary and prepare the response body
                response_body = [shipment.to_dict() for shipment in shipments]
                return make_response(response_body, 200)
            else:
                return make_response({'message': 'No shipments found for this customer'}, 404)

        except Exception as e:
            # Handle any unexpected errors
            return {'message': f'Error fetching shipments for customer {customer_id}: {e}'}, 500



    # handle shiipment booking POST request
    # POST request to book a shipment. we need to access the session.
    def post(self, customer_id):
        # breakpoint()
        # Fetch customer from the session
        customer = db.session.get(Customer, session.get('customer_id'))

        if not customer:
            return make_response({'error': 'Please log in'}, 401)

        data = request.get_json()

        # Check if required fields are provided
        if 'origin' not in data or 'vessel_name' not in data or 'container_type' not in data or 'comment' not in data:
            return make_response({'error': 'Missing required fields'}, 400)

        origin = data['origin']
        vessel_name = data['vessel_name']
        container_type = data['container_type']
        comment = data['comment']

        # Find the shipment in the database
        existing_shipment = Shipment.query.filter_by(
            origin=origin,
            vessel_name=vessel_name
        ).first()

        # breakpoint()
#existing shipment cant be found ?
        if existing_shipment and existing_shipment.status == 'In Transit':
            return make_response({'error': 'Shipment is currently not available to book.'}, 409)
        

        elif existing_shipment:
            # Use data from the existing shipment
            departure_time = existing_shipment.departure_time
            arrival_time = existing_shipment.arrival_time
            arrival_port = existing_shipment.arrival_port
            freight_rate = existing_shipment.freight_rate

            # Create a new shipment record
            new_shipment = Shipment(
                origin=origin,
                customer_id=customer_id,
                vessel_name=vessel_name,
                departure_time=departure_time,
                arrival_time=arrival_time,
                arrival_port=arrival_port,
                freight_rate=freight_rate,
                status='Pending'  # Adjust status
            )
            db.session.add(new_shipment)

            # create the container
            container = Container(
                container_type=container_type,
                customer_id=customer_id,
                price="pending",
                container_number="pending",
                weight=22000
            )

            db.session.add(container)
            db.session.commit()

            # Create a new association between the shipment and container
            shipment_container_association = ShipmentContainerAssociation(
                shipment_id=new_shipment.id,
                container_id=container.id,
                comment=comment
            )
            db.session.add(shipment_container_association)

            db.session.commit()

            return make_response(new_shipment.to_dict(), 201)

        else:
            # Handle the case where no matching shipment is found
            return make_response({'error': 'No existing shipment found with the given criteria.'}, 404)


api.add_resource(ShipmentsByCustomer, '/shipments/customer/<int:customer_id>')



class Containers(Resource):

    def get(self):
        # return all containers
        try:
            containers = db.session.query(Container).all()
            response_body = [container.to_dict(only=("id", "container_type", "price", "weight", "container_number")) for container in containers]

            return make_response(response_body, 200)
        
        except Exception as e:
            return {'error': f'Error fetching containers: {e}'}, 500
    

api.add_resource(Containers, '/containers')



if __name__ == '__main__':
    app.run(port=5555, debug=True)
