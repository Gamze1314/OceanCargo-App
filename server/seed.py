from app import app, db
from models import Customer, Shipment, Container
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
    #         credit_amount=round(random.uniform(450000, 1000000), 2
    #     )

    customer1 = Customer(
        name="gamze",
        username="gamze1517",
        password_hash=fake.password(),
        email="gamze@gmail.com",
        credit_amount=600000
    )

    customers.append(customer1)
    # customers.append(customer)

    #customers order by name before committing to the database
    


    db.session.add_all(customers)
    db.session.commit()

    print("Customer data seeded successfully")
    # Create 10 shipments
    # List of origin ports (outside U.S.)
    origin_ports = ["Istanbul", "Guangzhou", "Shanghai", "Mumbai",
                    "Genoa", "Hamburg"]

    # List of arrival ports (in U.S.)
    arrival_ports = ["New York", "Los Angeles", "Houston",
                     "Atlanta", "Vancouver", "Oakland"]

    statuses = ["In Transit", "To be Advised", "Arrived"]

    # generate fake shipment data with unique customer_id, and arrival and origin port(arrival != origin).
   # Function to generate a random date within the past year.

    def random_date(start, end):
        return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

    # List to store shipment objects.
    shipments = []
    start_date = datetime.now() - timedelta(days=365)
    end_date = datetime.now()

    # Shuffle origin_ports and arrival_ports to ensure uniqueness. each origin port routed to an unique arrival port.
    shuffled_origins = random.sample(origin_ports, len(origin_ports))
    shuffled_arrivals = random.sample(arrival_ports, len(arrival_ports))

    # Generate shipment data
    for i in range(6):
        departure_time = random_date(start_date, end_date)
        arrival_time = departure_time + timedelta(days=random.randint(1, 30))

        # Create the Shipment object, keeping departure_time and arrival_time as datetime objects
        shipment = Shipment(
            status=random.choice(statuses),
            vessel_name=fake.word().capitalize() + " Vessel",
            departure_time=departure_time,  # Store as datetime object
            arrival_time=arrival_time,      # Store as datetime object
            arrival_port=shuffled_arrivals[i],
            origin=shuffled_origins[i],
            freight_rate=round(random.uniform(3700.0, 9000.0), 2),
        )

        shipments.append(shipment)

    # departure_time=datetime.strptime("2024-10-01", "%Y-%m-%d"),  # Convert string to datetime
    # arrival_time = datetime.strptime(
    #     "2024-10-05", "%Y-%m-%d"),     # Convert string to datetime, when you create a shipment object.

    db.session.add_all(shipments)
    db.session.commit()

    print("Shipment data seeded successfully")

    # Create 10 containers
    containers = []
    prefixes = ["CBHU", "ECHU", "TRHU", "MSDU"]
    types = ["40SD", "20SD", "40HC"]
    for _ in range(10):
        shipment_ids = [s.id for s in shipments]
        container_number = fake.random_element(
            elements=prefixes) + str(fake.random_number(digits=6, fix_len=True))
        container = Container(
            container_number=container_number,
            container_type=fake.random_element(elements=types),
            # Price between $3500and $10000
            price=round(random.uniform(3700.0, 9000.0), 2),
            customer_id=1,
            shipment_id=random.choice(shipment_ids)
        )
        containers.append(container)

    db.session.add_all(containers)
    db.session.commit()

    print("Container data seeded successfully.")

    # The database is configured to use UTC, +4 hrs in EST.
