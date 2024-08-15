from faker import Faker
import random
from app import app, db
from models import Customer, Shipment, Container, ShipmentContainerAssociation

fake = Faker()

# Function to generate valid container numbers


def generate_container_number():
    prefixes = ['CBHU', 'ECHU', 'TRHU', 'MSDU']
    prefix = random.choice(prefixes)
    number = f"{random.randint(100000, 999999)}"
    return f"{prefix}{number}"


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
            # Ensure username is between 5 and 10 characters
            username=fake.user_name()[:10],
            password_hash=fake.password(),
            email=fake.email(),
            type=random.choice(['consignee', 'forwarder'])  # Valid types
        )
        db.session.add(customer)
        customers.append(customer)

    # Create shipments
    shipments = []
    for _ in range(10):
        shipment = Shipment(
            status=random.choice(
                ['In Transit', 'Completed']),  # Valid statuses
            vessel_name=fake.company(),
            departure_time=fake.date_time_this_year(
                before_now=True, after_now=False).strftime("%Y-%m-%d %H:%M:%S"),
            arrival_time=fake.date_time_this_year(
                before_now=False, after_now=True).strftime("%Y-%m-%d %H:%M:%S"),
            arrival_port=fake.city(),
            origin=fake.country(),
            freight_rate=round(random.uniform(500, 2000), 2),
            customer=random.choice(customers)
        )
        db.session.add(shipment)
        shipments.append(shipment)

    # Create containers
    containers = []
    for _ in range(10):
        container = Container(
            container_number=generate_container_number(),
            container_type=fake.word(),
            weight=random.randint(1000, 5000),
            price=round(random.uniform(100, 1000), 2),
            customer=random.choice(customers)
        )
        db.session.add(container)
        containers.append(container)

    # Create shipment-container associations
    for _ in range(10):
        association = ShipmentContainerAssociation(
            comment=fake.sentence(nb_words=5),
            shipment=random.choice(shipments),
            container=random.choice(containers)
        )
        db.session.add(association)

    # Commit all changes
    db.session.commit()

    print("Seed data added successfully.")
