import re
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property


# contains definitions of tables and associated schema constructs for db readability.
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)

# Customer model with SQL Alchemy constraints and relationships
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_rules = ('-containers.customer', '-password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    username = db.Column(db.String(10), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    credit_amount = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    __table_args__ = (
        db.CheckConstraint('name != username', name='check_name_not_username'),
    )

    containers = db.relationship(
        'Container', back_populates='customer', cascade='all')

    shipments = association_proxy(
        'containers', 'shipment', creator=lambda s: Container(shipment=s))

    @validates('name')
    def validate_name(self, key, value):
        # uppercase name
        if not value:
            raise ValueError(f'{key} can not be empty.')

        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')

        value_length = len(value)
        if value_length < 2 or value_length > 60:
            raise ValueError(
                f'{key} must be between 2 and 60 characters long.')
        return value

    # Validations: application-level => whenever new instance is created, and committed to db, validations executed.
    @validates('username')
    def validate_username(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')

        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')

        value_length = len(value)
        if value_length < 5 or value_length > 10:
            raise ValueError(
                f'{key} must be between 5 and 10 characters long.')
        return value

    @validates('email')
    def validate_email(self, key, value):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError('Email must be a valid email address.')
        return value

    def __repr__(self):
        return f'Customer (id: {self.id}, name: {self.name} username: {self.username}, passw_hash: {self.password_hash} email: {self.email}, credit_amount: {self.credit_amount})'


class Container(db.Model, SerializerMixin):
    __tablename__ = 'containers'

    serialize_rules = ('-customer.containers',
                       '-shipment.containers', 'total_cost')

    id = db.Column(db.Integer, primary_key=True)
    container_number = db.Column(db.String(10), nullable=False, unique=True)
    container_type = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    customer_id = db.Column(db.Integer, db.ForeignKey(
        'customers.id'), nullable=False)

    shipment_id = db.Column(db.Integer, db.ForeignKey(
        'shipments.id'), nullable=False)

    customer = db.relationship('Customer', back_populates='containers')

    shipment = db.relationship('Shipment', back_populates='containers')

    @validates('container_number')
    def validate_container_number(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) != 10:
            raise ValueError(f'{key} must have exactly 10 characters.')
        if not value[:4].isalpha():
            raise ValueError(f'{key} must start with 4 alphabetic characters.')
        if not value[4:].isdigit():
            raise ValueError(f'{key} must end with 6 digits.')
        return value

    @validates('container_type')
    def validate_container_type(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) < 4 or len(value) > 4:
            raise ValueError(f'{key} must be 4 characters long.')
        return value

    @validates('price')
    def validate_price(self, key, value):
        if value < 3500.0 or value > 10000.0:
            raise ValueError(f'{key} must be between 3500 and 10000.')
        return value

    @hybrid_property
    def total_cost(self):
        # if shipment exists, add freight rate else 0.00.
        return self.price + (self.shipment.freight_rate if self.shipment else 0)

    def __repr__(self):
        return f'Container(id={self.id}, container_number={self.container_number}, container_type={self.container_type}, price={self.price}, created_at={self.created_at}, updated_at={self.updated_at})'


class Shipment(db.Model, SerializerMixin):

    __tablename__ = 'shipments'

    serialize_rules = ('-containers.shipment',)

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(250), nullable=False)
    vessel_name = db.Column(db.String(30), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    arrival_port = db.Column(db.String(30), nullable=False)
    origin = db.Column(db.String(30), nullable=False)
    freight_rate = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    __table_args__ = (
        db.CheckConstraint('arrival_time != departure_time',
                           name='check_arrival_and_departure_date'),
    )

    containers = db.relationship(
        'Container', back_populates='shipment', cascade='all')

    customers = association_proxy(
        'containers', 'customer', creator=lambda c: Container(customer=c))

    @validates('status')
    def validate_status(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) > 250:
            raise ValueError(f'{key} can not be more than 250 characters.')
        return value

    @validates('vessel_name')
    def validate_vessel_name(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) > 30:
            raise ValueError(f'{key} can not be more than 30 characters.')
        return value

    @validates('freight_rate')
    def validate_rate(self, key, value):
        if value < 3500.0 or value > 10000.0:
            raise ValueError(f'{key} must be between 3500 and 10000.')
        return value

    @validates('origin')
    def validate_origin(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) > 30:
            raise ValueError(f'{key} can not be more than 30 characters.')
        return value

    @validates('arrival_port')
    def validate_arrival_port(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) > 30:
            raise ValueError(f'{key} can not be more than 30 characters.')
        return value

    def __repr__(self):
        return f'Shipment (id: {self.id}, status: {self.status}, vessel_name: {self.vessel_name}, departure_time: {self.departure_time}, arrival_time: {self.arrival_time}, arrival_port: {self.arrival_port}, origin: {self.origin}, freight_rate: {self.freight_rate})'
