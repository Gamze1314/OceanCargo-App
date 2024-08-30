from app import app, db
from models import Customer, Shipment, Container, ShipmentContainerAssociation
from faker import Faker
import random
from datetime import datetime, timedelta

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
    # for _ in range(10):
    #     customer = Customer(
    #         # Ensure username is 5-10 characters long
    #         username=fake.user_name()[0:10],
    #         password_hash=fake.password(),
    #         email=fake.email(),
    #         type=fake.random_element(elements=("consignee", "forwarder")),
    #         # Random credit amount
    #         credit_amount=round(random.uniform(450000, 1000000), 2)
    #     )

    customer1 = Customer(
        username="gamze1314",
        password_hash=fake.password(),
        email="gamze@gmail.com",
        type="consignee",
        credit_amount=600000
    )

    customers.append(customer1)
    # customers.append(customer)

    db.session.add_all(customers)
    db.session.commit()


    # Create 10 shipments
    # List of origin ports (outside U.S.)
    origin_ports = ["Istanbul", "Guangzhou", "Shanghai", "Mumbai",
                    "Genoa", "Hamburg"]

    # List of arrival ports (in U.S.)
    arrival_ports = ["New York", "Los Angeles", "Houston",
                    "Atlanta", "Vancouver", "Oakland"]
    
    statuses = ["In Transit", "Pending", "Completed"]


    #generate fake shipment data with unique customer_id, and arrival and origin port(arrival != origin).
    def random_date(start, end):
        return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))
    
    # Format the datetime object to the required string format


    def format_datetime(dt):
        return dt.strftime("%m/%d/%Y, %I:%M %p")
    
    shipments = []
    start_date = datetime.now() - timedelta(days=365)
    end_date = datetime.now()

    # Shuffle origin_ports to ensure uniqueness
    shuffled_origins = random.sample(origin_ports, len(origin_ports))
    shuffled_arrivals = random.sample(arrival_ports, len(arrival_ports))

    for i in range(6):
        departure_time = random_date(start_date, end_date)
        arrival_time = departure_time + timedelta(days=random.randint(1, 30))

        formatted_departure_time = format_datetime(departure_time)
        formatted_arrival_time = format_datetime(arrival_time)

        shipment = Shipment(
            status=random.choice(statuses),
            vessel_name=fake.word().capitalize() + " Vessel",
            departure_time=formatted_departure_time,
            arrival_time=formatted_arrival_time,
            arrival_port=shuffled_arrivals[i],
            origin=shuffled_origins[i],
            freight_rate=round(random.uniform(3700.0, 9000.0), 2),
            customer_id=random.choice(
                [customer.id for customer in Customer.query.all()])
        )

        shipments.append(shipment)

    db.session.add_all(shipments)
    db.session.commit()



    # Create 10 containers
    containers = []
    prefixes = ["CBHU", "ECHU", "TRHU", "MSDU"]
    types = ["40SD", "20SD", "40HC"]
    for _ in range(6):
        container_number = fake.random_element(
            elements=prefixes) + str(fake.random_number(digits=6, fix_len=True))
        container = Container(
            container_number=container_number,
            container_type=fake.random_element(elements=types),
            weight=random.randint(1000, 5000),  # Weight between 1000 and 5000
            # Price between $500 and $5000
            price=round(random.uniform(3700.0, 9000.0), 2),
            customer=random.choice(customers)
        )
        containers.append(container)

    db.session.add_all(containers)
    db.session.commit()

    # Create shipment-container associations ensuring container_id is unique, and if there are 10 shipments, there should be 10 containers unique associated.
    associations = [
        ShipmentContainerAssociation(
            comment='First container to be shipped early', shipment_id=1, container_id=1),
        ShipmentContainerAssociation(
            comment='Second container to be advised', shipment_id=2, container_id=2),
        ShipmentContainerAssociation(
            comment='Third container loaded', shipment_id=3, container_id=3),
        ShipmentContainerAssociation(
            comment='Fourth container for delivery', shipment_id=4, container_id=4),
        ShipmentContainerAssociation(
            comment='Fifth container to be shipped later', shipment_id=5, container_id=5),
        ShipmentContainerAssociation(comment='Sixth container', shipment_id=6, container_id=6)
    ]

    db.session.add_all(associations)
    db.session.commit()

    print("Seed data added successfully.")
