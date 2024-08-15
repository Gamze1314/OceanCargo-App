from flask import Flask, make_response, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
# import models
from models import db, Shipment, Container, Customer, ShipmentContainerAssociation

# create a Flask application object
app = Flask(__name__)

# configure a database connection to the local file app.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

# disable modification tracking to use less memory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# create a Migrate object to manage schema modifications
migrate = Migrate(app, db)

# # initialize the Flask application to use the database
db.init_app(app)



@app.route('/shipments')
def shipments():
    #return all shipments
    shipments = db.session.query(Shipment).all()
    response_body = [shipment.to_dict() for shipment in shipments]

    return make_response(response_body, 200)


@app.route('/shipments/<int:id>', methods=['GET'])
def get_shipment(id):
    # return a single shipment by its ID
    shipment = db.session.query(Shipment).filter_by(id=id).first()

    if shipment:
        return make_response(shipment.to_dict(), 200)
    else:
        return make_response({'message': 'Shipment not found'}, 404)


@app.route('/customers')
def customers():
    # return all customers
    customers = db.session.query(Customer).all()
    response_body = [customer.to_dict() for customer in customers]

    return make_response(response_body, 200)



@app.route('/containers')
def containers():
    # return all containers
    containers = db.session.query(Container).all()
    response_body = [container.to_dict() for container in containers]

    return make_response(response_body, 200)



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
