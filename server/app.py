from flask import Flask, make_response, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
# import models
from models import db, Shipment, Container, Customer, ShipmentContainerAssociation
import ipdb
from faker import Faker
import random
from datetime import timedelta

# Create the Flask application object
fake = Faker()

# create a Flask application object
app = Flask(__name__)

# set secret key to use session, to generate/change a secret key: run in terminal; python -c 'import os; print('os.urandom(16))'.
# <SecureCookieSession {'test': 'testing 123'}>
app.secret_key = b'\x86\xa8\xc1)\xc42\xdd\x15s\x81\x86\xc1\x18\x99B\xea'

# Set session lifetime ; expires after 60 mins of inactivity
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)

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


class CheckSession(Resource):

    def get(self):
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
# Resource : check_session => browser can save cookies thru proxy, keeps them logged in. when user logged in, remembers the username.


class Login(Resource):

    def post(self):
        # POST request to login the user. we need to access the session.
        data = request.json.get('username')
        # breakpoint()
        customer = Customer.query.filter(Customer.username == data).first()
        if customer:
            # if customer is found, store id the id in the session, and return 201 if successful.
            # keep them logged in with session ; customer.id => unique
            session['customer_id'] = customer.id
            session.permanent = True
            # cookie is saved in the browser., lasts for the duration specified(60 min) 
            response_body = customer.to_dict()
            return make_response(response_body, 201)
        else:
            # if customer is not found, return if not found.
            return make_response({'error': 'Invalid username'}, 401)


api.add_resource(Login, '/login')

# if customer logged in , show the contents to book the shipments, if not, redirect them to log in page.


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


class Customers(Resource):

    def post(self):
        # create a new customer object, add it to session ?
        try:
            data = request.get_json()

            if not 'username' or not 'email' or not 'type' or not 'credit_amount' in data:
                return {'error': 'Missing required fields'}, 400

            username = data['username']
            # 5-10 charcters long not empty

            if username:

                if len(username) > 10:
                    return {'error': 'Username should be between 5 and 10 characters long'}, 400

                if len(username) < 5:
                    return {'error': 'Username should be between 5 and 10 characters long'}, 400

            # search database if username exists , return error. 'username is already in use.
            existing_username = Customer.query.filter_by(
                username=username).first()

            if existing_username:
                return {'error': 'Username is already in use.'}, 400

            password_hash = fake.password()

            email = data['email']
            # must include '@'

            if email:
                if '@' not in email:
                    return {'error': "Invalid email address."}, 400

            type = data['type']
            # either forwarder or consignee

            if type not in ['consignee', 'forwarder']:
                return {'error': 'Type must be either consignee or forwarder.'}, 400

            credit_amount = data['credit_amount']

            if credit_amount:
                if not isinstance(credit_amount, (int, float)):
                    return {'error': 'Credit amount must be a number.'}, 400

            new_customer = Customer(username=username, password_hash=password_hash,
                                    email=email, type=type, credit_amount=credit_amount)

            # breakpoint()
            db.session.add(new_customer)
            db.session.commit()

            # set cookie here
            session['customer_id'] = new_customer.id

            # breakpoint()
            # return the created customer information
            return make_response(new_customer.to_dict(), 201)

        except Exception as e:
            # Handle any unexpected errors
            return {'message': f'Error creating customer: {e}'}, 500


api.add_resource(Customers, '/customers')


class CustomerByID(Resource):

    def patch(self, id):
        # update existing customer info.
        # check if customer exists
        customer = db.session.get(Customer, id)

        if not customer:
            return make_response({'error': 'Customer not found'}, 404)

        data = request.get_json()
        # update customer info
        customer.username = data.get('username', customer.username)
        customer.email = data.get('email', customer.email)
        customer.type = data.get('type', customer.type)
        customer.credit_amount = data.get(
            'credit_amount', customer.credit_amount)

        try:
            # save the changes to the database
            db.session.commit()
            return make_response(customer.to_dict(), 200)
        except Exception as e:
            # Handle any unexpected errors
            return {'message': f'Error updating customer: {e}'}, 500


api.add_resource(CustomerByID, '/customer/<int:id>')


class CustomerShipmentsResource(Resource):

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

       # data from frontend to be used in creation of shipment, container, shipment_container_association
        origin = data['origin']
        vessel_name = data['vessel_name']
        container_type = data['container_type']
        comment = data['comment']

        # Find the shipment in the database
        existing_shipment = Shipment.query.filter_by(
            origin=origin,
            vessel_name=vessel_name
        ).first()

        # check if existing shipment ?
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
            db.session.commit()

            # create new container=> unique constraint in association table.
            prefixes = ["CBHU", "ECHU", "TRHU", "MSDU"]
            new_container_number = fake.random_element(
                elements=prefixes) + str(fake.random_number(digits=6, fix_len=True))

            new_container = Container(
                container_number=new_container_number,
                container_type=container_type,
                weight=23000,
                price=5000 if container_type == '20SD' else 7500,
                customer_id=customer_id
            )

            db.session.add(new_container)
            db.session.commit()

            # Create a new association between the shipment and container
            shipment_container_association = ShipmentContainerAssociation(
                comment=comment,
                shipment_id=new_shipment.id,
                container_id=new_container.id
            )

            db.session.add(shipment_container_association)
            db.session.commit()

            # update customer's credit amount, - freight_rate, price
            customer = db.session.get(Customer, customer_id)
            if customer:
                # Subtract the total cost from the customer's credit amount
                total_cost = round(new_container.price +
                                   new_shipment.freight_rate, 2)
                updated_credit_amount = round(
                    customer.credit_amount, 2) - total_cost
                customer.credit_amount = updated_credit_amount
                # breakpoint()
            db.session.commit()

            # response_body => return shipment, and container serialized?
            response_body = {
                'id': new_shipment.id,
                'origin': new_shipment.origin,
                'vessel_name': new_shipment.vessel_name,
                'departure_time': new_shipment.departure_time,
                'arrival_time': new_shipment.arrival_time,
                'arrival_port': new_shipment.arrival_port,
                'freight_rate': new_shipment.freight_rate,
                'comment': comment,
                'status': new_shipment.status,
                'container': new_container.to_dict(),
                'total_cost': total_cost,
                'customer': customer.to_dict()
            }

            return make_response(response_body, 201)

        else:
            # Handle the case where no matching shipment is found
            return make_response({'error': 'No existing shipment found with the given criteria.'}, 404)

    # patch request => request data " comment"
    # find the shipment in the shipment_container_association table to update comment

    def patch(self, customer_id):

        # Get customer ID from the session
        customer_id = session.get('customer_id')

        # Return error if unauthorized
        if not customer_id:
            return make_response({'error': 'Please log in'}, 401)

        # Get comment from the request body
        data = request.get_json()
        comment = data.get('comment')
        shipment_id = data.get('shipment_id')

        # Get the shipment by shipment_id and customer_id
        shipment = db.session.query(ShipmentContainerAssociation).filter_by(
            shipment_id=shipment_id
        ).first()

        if not shipment:
            return make_response({'error': 'Shipment not found or not authorized'}, 404)

        # Check if comment is provided
        if not comment:
            return make_response({'error': 'Comment is required'}, 400)

        # Validate comment length
        if len(comment) < 1 or len(comment) > 50:
            return make_response({'error': 'Comment must be between 1 and 50 characters long'}, 400)

        # Update the comment
        shipment.comment = comment
        db.session.commit()

        # Return success message
        return make_response(shipment.to_dict(), 200)

    # handle delete request

    def delete(self, customer_id):
        # if a shipment is deleted, delete the association, and containers associated with the shipment.
        # Get customer ID from the session
        customer_id = session.get('customer_id')

        # Return error if unauthorized
        if not customer_id:
            return make_response({'error': 'Please log in'}, 401)

        # get shipment id
        data = request.get_json()
        shipment_id = data.get('id')

        shipment = Shipment.query.filter_by(id=shipment_id).first()

        if not shipment:
            return make_response({'error': 'The shipment can not be found.'})

        # Delete associations first, get all records associated with this shipment.
        associations = ShipmentContainerAssociation.query.filter_by(
            shipment_id=shipment_id).all()

        for association in associations:
            db.session.delete(association)

        db.session.delete(shipment)
        try:
            db.session.commit()
        except Exception as e:
            print(f"Error deleting shipment: {e}")
            db.session.rollback()
            return make_response({'error': 'Failed to delete shipment and associated containers.'}, 500)

        return make_response({'message': 'The shipment and associated containers have been deleted.'}, 200)


api.add_resource(CustomerShipmentsResource, '/shipments/customer/<int:customer_id>')
# changed endpoint to /customers/<int:customer_id>/shipments


class CustomerContainersResource(Resource):

    def get(self, customer_id):
        # return containers for customer in session. this resource is for displaying cont numbers on the GoogleMap component.
        # response : cont number, return all containers for customer logged in.
        #check customer_id in session : handle error
        # if customer found, query customer shipments, then shipment_cont_association to find containers. : handle errors if shipments not found.
        # return container_shipment association w cont info after serialization. : handle error in cases where cont not found.404
        #return 200, if successful. : 500.
        try:
            customer_id = session.get('customer_id')
            if customer_id is not None:
                customer = Customer.query.get(customer_id)
                if customer:
                    #container table holds customer_id fk.
                    # join table holds shipment_id, container_id.
                    # shipment holds customer_id.
                    # which container is tied in the association table , filter by customer id.

                    if not customer:
                        return make_response({'error': 'Please log in'}, 401)

                    #container number is unique for each shipment. can be associaed with one shipment only.

                    results = db.session.query(Shipment, Container).join(ShipmentContainerAssociation, Shipment.id == ShipmentContainerAssociation.shipment_id).join(
                        Container, ShipmentContainerAssociation.container_id == Container.id).filter(Shipment.customer_id == customer_id).all()
 
                    # [(shipment.arrival_time, container.container_number)
                    #  for shipment, container in results]

                    # [(shipment.arrival_time, container.container_number)
                    #  for shipment, container in results]


                    # [('2024-09-07 05:52:15.021953', 'TRHU317121'), ('2024-08-29 21:56:35.407938', 'CBHU583196'), ('2024-09-03 00:47:20.391864', 'CBHU893777'), ('2024-09-17 06:49:03.559604', 'ECHU530168'), ('2024-09-11 11:55:42.972324', 'CBHU339330'),
                    #  ('2024-09-04 16:04:34.737162', 'TRHU743431'), ('2024-09-14 04:23:02.469636', 'ECHU410200'), ('2024-09-24 04:47:52.332018', 'ECHU787866'), ('2024-09-27 23:57:08.657412', 'MSDU137019'), ('2024-09-09 07:48:23.373110', 'MSDU175914')]

                    if not results:
                        #return 404
                        return make_response({'error': 'Shipment and container information is not found'}, 404)
        
                   #each shipment and container tuple in unpacked to access shipment and container information.
                    response_body = [
                        {
                            'shipment_id': shipment.id,
                            'vessel_name': shipment.vessel_name,
                            'container_number': container.container_number,
                            'container_type': container.container_type,
                            'ocean_rate': shipment.freight_rate,
                            'container_price': container.price,
                            'arrival_time': shipment.arrival_time,
                            'departure_time': shipment.departure_time,
                            'arrival_port': shipment.arrival_port,
                            'origin': shipment.origin
                        }
                        for shipment, container in results
                    ]

                    return make_response(response_body, 200)

                
        except:
            return make_response({'error': 'Failed to retrieve containers.'}, 500)
            


api.add_resource(CustomerContainersResource,
                 '/customers/<int:customer_id>/containers')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
