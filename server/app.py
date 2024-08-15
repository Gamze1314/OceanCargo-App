from flask import Flask, make_response, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource

from flask_migrate import Migrate

from models import db
#import models

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
