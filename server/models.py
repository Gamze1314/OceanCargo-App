#models goes here
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin


convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)



# // destination belongs to a shipment if we create another table.
# // dropdown for destinations, and show shipments based on destination.



# Customers have many containers
# Container can have many customers(consignee or forwarder)

# Container_customer_association = > is a join table to define the relationship between containers and customers(if a container is already hired or who it belongs to.)

# Customer has many shipments.
# Shipment belongs to a customer.

# Shipment can have many containers
# Container belongs to a shipment.


#class Customer=> has customers login/logout information.
# add validations/relationships

# def __repr__(self):

#     id integer[primary key]
#     first_name string
#     last_name string
#     username string
#     password_hash string
#     email string
#     phone string
#     address string
#     type string

class Customer(db.Model, SerializerMixin):
    __tablenme__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    type = db.Column(db.String, nullable=False)  # type of customer (consignee, forwarder, etc.)

    def __repr__(self):
        return f'Customer(id={self.id}, username={self.username}, name={self.name} {self.last_name}, email={self.email}, phone={self.phone}, address={self.address}, type={self.type})'



#class Container => defines cont type, weight, price
#add validation for types, weight, and price columns


# def __repr__(self):

# Table containers {
#     id integer[primary key]
#     container_number string
#     container_type string
#     weight integer
#     price float
#     owner string
#     shipment_id integer
# }

class Container(db.Model, SerializerMixin):
    __tablename__ = 'containers'

    id = db.Column(db.Integer, primary_key=True)
    container_number = db.Column(db.String, nullable=False)
    container_type = db.Column(db.String, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    #foreign key to define relationship btw shipments and containers.
    #shipment can have many containers, container belongs to a shipment.
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipments.id'))



    def __repr__(self):
        return f'Container(id={self.id}, container_number={self.container_number}, type={self.container_type}, weight={self.weight}, price={self.price}, owner={self.owner}, shipment_id={self.shipment_id})'

#class Shipment => holds foreign keys.
#add validations/relationships

# def __repr__(self):

# Table shipments{
#     id integer[primary key]
#     status string
#     vessel_name string
#     departure_time string
#     arrival_time string
#     arrival_port string
#     origin string
#     freight_rate float
#     customer_id integer
# }

class Shipment(db.Model, SerializerMixin):

    __tablename__ ='shipments'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)
    vessel_name = db.Column(db.String, nullable=False)
    departure_time = db.Column(db.String, nullable=False)
    arrival_time = db.Column(db.String, nullable=False)
    arrival_port = db.Column(db.String, nullable=False)
    origin = db.Column(db.String, nullable=False)
    freight_rate = db.Column(db.Float, nullable=False)

    #foreign key to define relationship btw shipments and customers.
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))

    def __repr__(self):
        return f'Shipment(id={self.id}, status={self.status}, vessel_name={self.vessel_name}, departure_time={self.departure_time}, arrival_time={self.arrival_time}, arrival_port={self.arrival_port}, origin={self.origin}, freight_rate={self.freight_rate}, customer_id={self.customer_id})'




#join = customer_container_association

# Table container_customer_association {
#     id integer[primary key]
#     hire_date string
#     status string
#     total_price float
#     container_id integer
#     customer_id integer
#     shipment_id integer // Added to link to shipments
# }

class customer_container_association(db.Model, SerializerMixin):
    __tablename__ = 'container_customer_association'

    id = db.Column(db.Integer, primary_key=True)
    hire_date = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    #foreign key to define relationship btw containers and customers.
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipments.id'))  # Added to link to shipments

    def __repr__(self):
        return f'customer_container_association(id={self.id}, hire_date={self.hire_date}, status={self.status}, total_price={self.total_price}, container_id={self.container_id}, customer_id={self.customer_id}, shipment_id={self.shipment_id})'
    

class ShipmentContainerAssociation(db.Model, SerializerMixin):
    __tablename__ = 'shipment_container_association'

    id = db.Column(db.Integer, primary_key=True)


    shipment_id = db.Column(db.Integer, db.ForeignKey(
        'shipments.id'), nullable=False)
    container_id = db.Column(db.Integer, db.ForeignKey(
        'containers.id'), nullable=False)

    # Relationships
    # shipment = db.relationship(
    #     'Shipment', back_populates='shipment_container_associations')
    # container = db.relationship(
    #     'Container', back_populates='shipment_container_associations')

    def __repr__(self):
        return f'<ShipmentContainerAssociation(shipment_id={self.shipment_id}, container_id={self.container_id})>'
