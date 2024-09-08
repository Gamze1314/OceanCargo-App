from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
import re


#contains definitions of tables and associated schema constructs.
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)


# customer has many containers => one to many
# shipment has many containers.
# container belongs to a shipment
# container belongs to a customer
# shipment has many customers through containers.
# customer has many shipments through containers.

#container(join) shipment_id, customer_id


# Customer model with relationships
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_rules = ('-containers.customer','-password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    credit_amount = db.Column(db.Float, nullable=False)

    # Relationships
    # customer has many containers => one to many
    containers = db.relationship('Container', back_populates='customer', cascade='all')
    # back_populates='customer' => opposite relationship(reciprocal)

    #customer's shipments
    shipments = association_proxy(
        'containers', 'shipment', creator=lambda s: Container(shipment=s))

    # Validations
    @validates('username')
    def validate_username(self, key, value):
        # Username must be between 5 and 10 characters long and not empty
        if len(value) < 5 or len(value) > 10 or value == '':
            raise ValueError(
                'Username must be between 5 and 10 characters long and not empty.')
        return value


    @validates('email')
    def validate_email(self, key, value):
        # Email must be a valid email address
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError('Email must be a valid email address.')
        return value

    def __repr__(self):
        return f'Customer (id: {self.id}, username: {self.username}, passw_hash: {self.password_hash} email: {self.email}, credit_amount: {self.credit_amount})'



# Container model with relationships
class Container(db.Model, SerializerMixin):
    __tablename__ = 'containers'

    serialize_rules = ('-customer.containers', '-shipment.containers')

    id = db.Column(db.Integer, primary_key=True)
    container_number = db.Column(db.String, nullable=False, unique=True)
    container_type = db.Column(db.String, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)


    #foreign keys to set up the relationships
    #container belongs to a customer.
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)

    #shipment_id fk; Container belongs to a shipment.
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipments.id'), nullable=False)


    #relationship to customer
    customer = db.relationship('Customer', back_populates='containers')

    #relationship to shipment
    shipment = db.relationship('Shipment', back_populates='containers')


    # validations
    @validates('price')
    def validate_price(self, key, value):
        if not isinstance(value, float):
            raise TypeError('The container price must be a floating number.')
        if value < 3500.0 or value > 10000.0:
            raise ValueError('Container price must be between 3500 and 10000.')
        return value
    
    # from decimal import Decimal, InvalidOperation

    def __repr__(self):
        return f'Container(id={self.id}, container_number={self.container_number}, type={self.container_type}, weight={self.weight}, price={self.price})'



# Shipment model with relationships
class Shipment(db.Model, SerializerMixin):

    __tablename__ = 'shipments'

    serialize_rules = ('-containers.shipment',)

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)
    vessel_name = db.Column(db.String, nullable=False)
    departure_time = db.Column(db.String, nullable=False)
    arrival_time = db.Column(db.String, nullable=False)
    arrival_port = db.Column(db.String, nullable=False)
    origin = db.Column(db.String, nullable=False)
    freight_rate = db.Column(db.Float, nullable=False)


    # Relationship
    #if a shipment is deleted, deletes all associated containers.
    containers = db.relationship('Container', back_populates='shipment', cascade='all')


    #customers and shipments many to many
    customers = association_proxy('containers', 'customer', creator = lambda c: Container(customer = c))


    # validations
    @validates('status')
    def validate_status(self, key, value):
        # status can either be In Transit or Completed
        if len(value) > 10:
            raise ValueError('The characters for the status attribute can not be more than 10.')
        else:
            return value

    @validates('freight_rate')
    def validate_rate(self, key, value):
        if not isinstance(value, float):
            raise TypeError('The freight rate must be a floating number.')
        if value < 3500.0 or value > 10000.0:
            raise ValueError('the freight rate must be between 3500 and 10000.')
        return value
    
    #validate origin and arrival port, must be unique 
    @validates('origin')
    def validate_origin(self, key, value):
        if len(value) > 15:
            raise ValueError(
                "The origin port can not be more than 15 characters.")
        return value
    

    @validates('arrival_port')
    def validate_arrival_port(self, key, value):
        if len(value) > 15:
            raise ValueError(
                "The arrival port can not be more than 15 characters.")
        return value
        


    def __repr__(self):
        return f'Shipment (id: {self.id}, status: {self.status}, vessel_name: {self.vessel_name}, departure_time: {self.departure_time}, arrival_time: {self.arrival_time}, arrival_port: {self.arrival_port}, origin: {self.origin}, freight_rate: {self.freight_rate})'
