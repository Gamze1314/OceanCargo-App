#models goes here
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin


metadata = MetaData()

db = SQLAlchemy(metadata=metadata)




# // destination belongs to a shipment if we create another table.
# // dropdown for destinations, and show shipments based on destination.



# Customers have many containers
# Container can have many customers(consignee or forwarder)

# Container_customer_association = > is a join table to define the relationship between containers and customers(if a container is already hired or who it belongs to.)

# Customer has many shipments.
# Shipment belongs to a customer.

# Shipment can have many containers
# Container belongs to a shipment.



#class Customer=> has customers login/logout information.
# add validations/relationships

#def __repr__(self):

#     id integer[primary key]
#     first_name string
#     last_name string
#     username string
#     password_hash string
#     email string
#     phone string
#     address string
#     type string





#class Container => defines cont type, weight, price
#add validation for types, weight, and price columns


# def __repr__(self):

# Table containers {
#     id integer[primary key]
#     container_number string
#     container_type string
#     weight integer
#     price float
#     owner string
#     shipment_id integer
# }




#class Shipment => holds foreign keys.
#add validations/relationships

# def __repr__(self):

# Table shipments{
#     id integer[primary key]
#     status string
#     vessel_name string
#     departure_time string
#     arrival_time string
#     arrival_port string
#     origin string
#     freight_rate float
#     customer_id integer
# }




#class Destination
# add validations/relationships

# def __repr__(self):


# Table destinations{
#     id integer[primary key]
#     location_name string
#     inland_price float
#     shipment_id integer
# }



#join = customer_container_association
# add validations/relationships

# def __repr__(self):


# Table container_customer_association {
#     id integer[primary key]
#     hire_date string
#     status string
#     total_price float
#     container_id integer
#     customer_id integer
#     shipment_id integer // Added to link to shipments
# }
