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

    # Create 10 customers
    customers = []
    for _ in range(10):
        customer = Customer(
            # Ensure username is 5-10 characters long
            username=fake.user_name()[0:10],
            password_hash=fake.password(),
            email=fake.email(),
            type=fake.random_element(elements=("consignee", "forwarder")),
            # Random credit amount
            credit_amount=round(random.uniform(450000, 1000000), 2)
        )
        customers.append(customer)

    db.session.add_all(customers)
    db.session.commit()

    # Create 10 shipments
    shipments = []
    for _ in range(10):
        shipment = Shipment(
            status=fake.random_element(elements=("In Transit", "Completed")),
            vessel_name=fake.word().capitalize() + " Vessel",
            departure_time=fake.date_time_between(
                start_date="-1y", end_date="now"),
            arrival_time=fake.date_time_between(
                start_date="now", end_date="+30d"),
            arrival_port=fake.city(),
            origin=fake.city(),
            freight_rate=round(random.uniform(500.0, 5000.0), 2),
            customer=random.choice(customers)
        )
        shipments.append(shipment)

    db.session.add_all(shipments)
    db.session.commit()

    # Create 10 containers
    containers = []
    prefixes = ["CBHU", "ECHU", "TRHU", "MSDU"]
    for _ in range(10):
        container_number = fake.random_element(
            elements=prefixes) + str(fake.random_number(digits=6, fix_len=True))
        container = Container(
            container_number=container_number,
            container_type=fake.word().capitalize() + " Type",
            weight=random.randint(1000, 5000),  # Weight between 1000 and 5000
            # Price between $500 and $5000
            price=round(random.uniform(3500.0, 5000.0), 2),
            customer=random.choice(customers)
        )
        containers.append(container)

    db.session.add_all(containers)
    db.session.commit()

    # Create shipment-container associations ensuring container_id is unique
    associations = [
        ShipmentContainerAssociation(
            comment='First container to be shipped early', shipment_id=1, container_id=1),
        ShipmentContainerAssociation(
            comment='Second container to be advised', shipment_id=1, container_id=2),
        ShipmentContainerAssociation(
            comment='Third container loaded', shipment_id=2, container_id=3),
    ]

    db.session.add_all(associations)
    db.session.commit()

    print("Seed data added successfully.")
