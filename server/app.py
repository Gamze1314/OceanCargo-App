from flask import Flask, make_response, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
# import models
from models import db, Shipment, Container, Customer, ShipmentContainerAssociation
import ipdb

# create a Flask application object
app = Flask(__name__)

#set secret key to use session, to generate/change a secret key: run in terminal; python -c 'immport os; print('os.urandom(16))'.
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
            #keep them logged in with session ; customer.id => unique
            session['customer_id'] = customer.id
            #session.get('customer_id')
            #cookie is saved in the browser.
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
        # Clear the session and return a 200 OK response
        session['customer_id'] = None
        return {'message': 'Logged out successfully'}, 204

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


# @app.route('/shipments/<int:id>', methods=['GET'])
# def get_shipment(id):
#     # return a single shipment by its ID
#     shipment = db.session.query(Shipment).filter_by(id=id).first()

#     if shipment:
#         return make_response(shipment.to_dict(), 200)
#     else:
#         return make_response({'message': 'Shipment not found'}, 404)


# @app.route('/customers')
# def customers():
#     # return all customers
#     customers = db.session.query(Customer).all()
#     response_body = [customer.to_dict() for customer in customers]

#     return make_response(response_body, 200)



# @app.route('/containers')
# def containers():
#     # return all containers
#     containers = db.session.query(Container).all()
#     response_body = [container.to_dict() for container in containers]

#     return make_response(response_body, 200)



# @app.route('/shipments/<int:shipment_id>/book', methods=['POST'])
# def book_shipment(shipment_id):
#     # Get the shipment by its ID
#     shipment = db.session.query(Shipment).filter_by(id=shipment_id).first()

#     # Check if the shipment is intransit
#     if shipment.status == 'intransit':
#         return jsonify({'message': 'This shipment is not bookable. It is currently in transit.'}), 400
#     else:
#         # Get the comment from the request payload
#         comment = request.json.get('comment', None)

#         # Create a new ShipmentContainerAssociation instance with the comment
#         new_association = ShipmentContainerAssociation(comment=comment)

#         # Associate the new ShipmentContainerAssociation instance with the shipment
#         new_association.shipment_id = shipment_id

#         # Save the new ShipmentContainerAssociation instance to the database
#         db.session.add(new_association)
#         db.session.commit()

#         return jsonify({'message': 'Shipment booked successfully'}), 201


if __name__ == '__main__':
    app.run(port=5555, debug=True)
