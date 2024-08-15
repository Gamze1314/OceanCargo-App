from app import app, db
from models import Customer, Shipment, Container, ShipmentContainerAssociation
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Create an application context to access the database
with app.app_context():
    # Drop existing tables
    db.drop_all()

    # Create all tables
    db.create_all()

    # Create customers
    customers = []
    for _ in range(10):
        customer = Customer(
            username=fake.user_name(),
            password_hash=fake.password(),
            email=fake.email(),
            type=random.choice(["consignee", "forwarder"])
        )
        customers.append(customer)

    # Create containers
    containers = []
    for _ in range(10):
        container = Container(
            container_number=fake.bothify(text='CBHU######'),
            container_type=random.choice(["40HC", "20SD", "45HC", "45OT", "20OT", "40SD"]),
            weight=random.randint(1500, 30400),
            price=round(random.uniform(1800, 8300), 2),
            # Randomly associate with a customer
            customer=random.choice(customers)
        )
        containers.append(container)

    # Create shipments
    shipments = []
    for _ in range(10):
        shipment = Shipment(
            status=random.choice(["In Transit", "Completed"]),
            vessel_name=fake.company(),
            departure_time=fake.date_time_this_year(),
            arrival_time=fake.date_time_this_year(),
            arrival_port=fake.city(),
            origin=fake.city(),
            freight_rate=round(random.uniform(500, 1500), 2),
            # Randomly associate with a customer
            customer=random.choice(customers)
        )
        shipments.append(shipment)

    # Create shipment-container associations
    associations = []
    for _ in range(10):
        association = ShipmentContainerAssociation(
            shipment=random.choice(shipments),
            container=random.choice(containers),
            comment=fake.text(max_nb_chars=50)  # User submittable attribute, maximum 100 characters.
        )
        associations.append(association)

    # Add all instances to the session and commit
    db.session.add_all(customers + containers + shipments + associations)
    db.session.commit()

    print("Seed data added successfully.")
