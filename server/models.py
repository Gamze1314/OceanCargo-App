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


# shipment.customer.containers => access the customers' containers through shipment's table.
# customer.shipments

# shipments & containers => many to many
# shipments & customers => one to many
# customer & container => one to many


class ShipmentContainerAssociation(db.Model, SerializerMixin):
    __tablename__ = 'shipment_container_association'

    id = db.Column(db.Integer, primary_key=True)
    # user submittable attribute
    comment = db.Column(db.String, nullable=False)

    shipment_id = db.Column(db.Integer, db.ForeignKey(
        'shipments.id'), nullable=False)
    container_id = db.Column(db.Integer, db.ForeignKey(
        'containers.id'), nullable=False)

    shipment = db.relationship(
        'Shipment', back_populates='shipment_container_associations')
    container = db.relationship(
        'Container', back_populates='shipment_container_associations')

    def __repr__(self):
        return f'<ShipmentContainerAssociation(shipment_id={self.shipment_id}, container_id={self.container_id})>'

# Customer model with relationships

class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    # type of customer (consignee, forwarder, etc.)
    type = db.Column(db.String, nullable=False)

    # Relationship to Shipment
    shipments = db.relationship('Shipment', back_populates='customer')
    # relationship to Containers
    containers = db.relationship('Container', back_populates='customer')

    def __repr__(self):
        return f'Customer(id={self.id}, username={self.username}, email={self.email}, type={self.type})'

# Container model with relationships

class Container(db.Model, SerializerMixin):
    __tablename__ = 'containers'

    id = db.Column(db.Integer, primary_key=True)
    container_number = db.Column(db.String, nullable=False)
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

    def __repr__(self):
        return f'Container(id={self.id}, container_number={self.container_number}, type={self.container_type}, weight={self.weight}, price={self.price})'

# Shipment model with relationships

class Shipment(db.Model, SerializerMixin):

    __tablename__ = 'shipments'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)
    vessel_name = db.Column(db.String, nullable=False)
    departure_time = db.Column(db.String, nullable=False)
    arrival_time = db.Column(db.String, nullable=False)
    arrival_port = db.Column(db.String, nullable=False)
    origin = db.Column(db.String, nullable=False)
    freight_rate = db.Column(db.Float, nullable=False)

    # Relationship to Customer
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    customer = db.relationship('Customer', back_populates='shipments')

    # Relationship to ShipmentContainerAssociation
    shipment_container_associations = db.relationship(
        'ShipmentContainerAssociation', back_populates='shipment')

    def __repr__(self):
        return f'Shipment(id={self.id}, status={self.status}, vessel_name={self.vessel_name}, departure_time={self.departure_time}, arrival_time={self.arrival_time}, arrival_port={self.arrival_port}, origin={self.origin}, freight_rate={self.freight_rate})'
