from flask import Flask, make_response, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
# import models
from models import db, Shipment, Container, Customer
from faker import Faker
from datetime import datetime

# Create the Flask application object
fake = Faker()

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

api = Api(app)



class Shipments(Resource):

    def get(self):
        try:
            # Fetch all shipments from the database
            shipments = Shipment.query.all()

            # Check if shipments are found
            if shipments:
                # Serialize each shipment and associated containers.
                response_body = [shipment.to_dict() for shipment in shipments]
                return make_response(response_body, 200)
            else:
                return make_response({'message': 'No shipments found'}, 404)

        except ValueError as e:
            # Handle any unexpected errors
            abort(500, e.args[0])


api.add_resource(Shipments, '/shipments')


class Containers(Resource):
    def get(self):
        try:
            # Fetch all containers from the database
            containers = Container.query.all()

            # Check if containers are found
            if containers:
                # Serialize each container and associated shipment.
                response_body = [container.to_dict()
                                 for container in containers]
                return make_response(response_body, 200)
            else:
                abort(404, e.args[0])

        except ValueError as e:
            # Handle any unexpected errors
            abort(500, e.args[0])

    def post(self):
        try:
            # create new container ; data: container number, type, shipment id, and customer id default 1.
            data = request.get_json()
            container_number = data.get('container_number')
            container_type = data.get('container_type')
            shipment_id = data.get('shipment_id')

            # Validate input data
            if not all([container_number, container_type, shipment_id]):
                abort(
                    400, description='Missing or invalid input: container_number, container_type, and shipment_id are required.')
            # breakpoint()
            # Determine price based on container type
            if '20' in container_type:
                price = 4000.00
            else:
                price = 7000.00

            # Create a new container instance
            new_container = Container(
                container_number=container_number,
                container_type=container_type,
                price=price,
                customer_id=1, # default customer
                shipment_id=shipment_id  # selected shipment id
            )
            # Add the new container to the session and commit
            db.session.add(new_container)
            db.session.commit()

            response_body = new_container.to_dict()

            return make_response(response_body, 201)

        except ValueError as e:
            abort(422, e.args[0]) #raises 422, and error message. Unprocessable entity.


api.add_resource(Containers, '/containers')


class ContainerByID(Resource):


    def get(self, id):
        try:
            # Fetch the container by id from the database
            container = Container.query.get(id)

            # Check if container is found
            if container:
                # Serialize the container and associated shipment.
                response_body = container.to_dict()
                return make_response(response_body, 200)
            else:
                abort(404, description="Container not found") # raise HTTP Exception.

        except ValueError as e:
            # Handle any unexpected errors
            abort(500, e.args[0])

    def patch(self, id):
        try:
            # Parse the request data to update the container
            data = request.json #cont number and type to be updated.

            #validate data 
            container_number = data.get('container_number')

            if not container_number: # string(10), unique, not null
                return make_response({'message': 'Container number is required'}, 400)
            if not isinstance(container_number, str):
                return make_response({'message': 'Container number must be a string'}, 400)
            if not len(container_number) == 10:
                return make_response({'message': 'Container number must have exactly 10 characters'}, 400)
            
            container_type = data.get('container_type')

            if not container_type: # string(20), not null
                return make_response({'message': 'Container type is required'}, 400)
            if not isinstance(container_type, str):
                return make_response({'message': 'Container type must be a string'}, 400)
            
            
            # Find the container by id
            container = Container.query.filter_by(id=id).first()

            if container:
            # Update the container fields, if type changes to 40 => or 20 , update price. Otherwise, keep the container fields same. updated_at , datetime.now()

            #check if container number is valid, string, and not empty  
                if '20' in container_type:
                    price = 4000.00
                else:
                    price = 7000.00


                container.container_number = container_number
                container.container_type = container_type
                container.price = price

                # Commit the changes
                db.session.commit()

                response_body = container.to_dict()

                return make_response(response_body, 200)
            else:
                return make_response({'message': 'Container not found'}, 404)

        except ValueError as e:
            # Handle any unexpected errors
            abort(500, e.args[0])
        


    def delete(self, id):
        try:
            # Find the container by id
            container = Container.query.filter_by(id=id).first()

            if not container:
                abort(404, description="Container not found")
                # Delete the container from the session
            db.session.delete(container)
            db.session.commit()

            response_dict = {"message": "The container is successfully deleted."}

            return make_response(response_dict, 200)

        except ValueError as e:
            db.session.rollback()
            # Handle server errors
            abort(500, e.args[0])
        

api.add_resource(ContainerByID, '/containers/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)


