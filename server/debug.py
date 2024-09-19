from models import db, Shipment, Container, Customer
import ipdb
from app import app


with app.app_context():

    shipments = Shipment.query.all()
    containers = Container.query.all()
    customers = Customer.query.all()

    print(shipments)
    print(containers)
    print(customers)

    s1 = Shipment.query.first()

    print(s1.containers)
    print(s1.customers)

    c1 = Container.query.first()
    print(c1.shipment)
    print(c1.customer)


    user = Customer.query.first()
    print(user.containers)
    print(user.shipments)


ipdb.set_trace()
