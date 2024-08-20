from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
# from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import re


convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)


# shipment.customer.containers => access the customers' containers through shipment's table.
# customer.shipments

# shipments & containers => many to many
# shipments & customers => one to many
# customer & container => one to many


class ShipmentContainerAssociation(db.Model, SerializerMixin):
    __tablename__ = 'shipment_container_associations'

    serialize_only = ('id', 'comment', 'shipment_id', 'container_id')

    id = db.Column(db.Integer, primary_key=True)
    # user submittable attribute
    comment = db.Column(db.String, nullable=False)

    shipment_id = db.Column(db.Integer, db.ForeignKey(
        'shipments.id'), nullable=False)
    container_id = db.Column(db.Integer, db.ForeignKey(
        'containers.id'), nullable=False, unique=True)

    shipment = db.relationship(
        'Shipment', back_populates='shipment_container_associations')
    container = db.relationship(
        'Container', back_populates='shipment_container_associations')

    # what check constraints can be added ?
    #  check that the container is not already assigned to the shipment ;  shipment can have many unique containers.
    # Database-level constraints
    __table_args__ = (
        db.UniqueConstraint('container_id', name='uq_container_id'),
    )

    # validations

    @validates('comment')
    def validate_comment(self, key, value):
        # Comment must be between 1 and 50 characters long and not empty
        if value is None or len(value) == 0 or len(value) > 50:
            raise ValueError(
                'Comment must be between 1 and 50 characters long and not empty.')
        return value

    def __repr__(self):
        return f'<ShipmentContainerAssociation(shipment_id={self.shipment_id}, container_id={self.container_id}, comment: {self.comment})>'



# Customer model with relationships
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_only = ('id', 'username', 'email', 'credit_amount')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    # type of customer (consignee, forwarder, etc.)
    type = db.Column(db.String, nullable=False)
    credit_amount = db.Column(db.Float, nullable=False)

    # what check constraints can be added ?
    # (e.g., check that the customer has sufficient credit to cover the shipment's price)
    # Database-level constraints
    __table_args__ = (
        db.CheckConstraint('credit_amount >= 3000.0',
                           name='credit_amount_positive'),
    )

    # Relationship to Shipment
    shipments = db.relationship('Shipment', back_populates='customer')
    # relationship to Containers
    containers = db.relationship('Container', back_populates='customer')

    # Validations
    @validates('username')
    def validate_username(self, key, value):
        # Username must be between 5 and 10 characters long and not empty
        if len(value) < 5 or len(value) > 10 or value == '':
            raise ValueError(
                'Username must be between 5 and 10 characters long and not empty.')
        return value

    @validates('type')
    def validate_type(self, key, value):
        # Type must be either 'consignee' or 'forwarder'
        if value not in ['consignee', 'forwarder']:
            raise ValueError('Type must be either consignee or forwarder.')
        return value

    @validates('email')
    def validate_email(self, key, value):
        # Email must be a valid email address
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError('Email must be a valid email address.')
        return value

    def __repr__(self):
        return f'Customer (id: {self.id}, username: {self.username}, passw_hash: {self.password_hash} email: {self.email}, type: {self.type}, credit_amount: {self.credit_amount})'



# Container model with relationships
class Container(db.Model, SerializerMixin):
    __tablename__ = 'containers'

    serialize_only = ('id', 'container_number', 'container_type', 'weight', 'price', 'customer')

    id = db.Column(db.Integer, primary_key=True)
    container_number = db.Column(db.String, nullable=False, unique=True)
    container_type = db.Column(db.String, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    customer_id = db.Column(db.Integer, db.ForeignKey(
        'customers.id'), nullable=False)

    # Relationship to ShipmentContainerAssociation
    shipment_container_associations = db.relationship(
        'ShipmentContainerAssociation', back_populates='container')

    # relationship to customer
    customer = db.relationship('Customer', back_populates='containers')

    # validations
    # container price is more than 3500 min, and max 10000
    @validates('price')
    def validate_price(self, key, value):
        if value < 3500.0 or value > 10000.0:
            raise ValueError('Container price must be between 3500 and 10000.')
        return value

    def __repr__(self):
        return f'Container(id={self.id}, container_number={self.container_number}, type={self.container_type}, weight={self.weight}, price={self.price})'



# Shipment model with relationships
class Shipment(db.Model, SerializerMixin):

    __tablename__ = 'shipments'

    serialize_only = ('id', 'status', 'vessel_name', 'departure_time', 'arrival_time', 'arrival_port', 'origin', 'freight_rate', 'customer_id')

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)
    vessel_name = db.Column(db.String, nullable=False)
    departure_time = db.Column(db.String, nullable=False)
    arrival_time = db.Column(db.String, nullable=False)
    arrival_port = db.Column(db.String, nullable=False)
    origin = db.Column(db.String, nullable=False)
    freight_rate = db.Column(db.Float, nullable=False)

    # Relationship to Customer
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    customer = db.relationship('Customer', back_populates='shipments')

    # Relationship to ShipmentContainerAssociation
    shipment_container_associations = db.relationship(
        'ShipmentContainerAssociation', back_populates='shipment')

    # validations
    @validates('status')
    def validate_status(self, key, value):
        # status can either be In Transit or Completed
        if value not in ['In Transit', 'Completed', 'Pending']:
            raise ValueError('Status must be either In Transit or Completed.')
        else:
            return value
        


    def __repr__(self):
        return f'Shipment (id: {self.id}, status: {self.status}, vessel_name: {self.vessel_name}, departure_time: {self.departure_time}, arrival_time: {self.arrival_time}, arrival_port: {self.arrival_port}, origin: {self.origin}, freight_rate: {self.freight_rate}, customer_id: {self.customer_id})'


# shipment.customer.containers => access the customers' containers through shipment's table.
# customer.shipments

# shipments & containers => many to many
# shipments & customers => one to many
# customer & container => one to many
