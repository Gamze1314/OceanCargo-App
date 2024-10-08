"""create tables

Revision ID: 8902bfcc9dc7
Revises: 
Create Date: 2024-10-04 15:06:41.111850

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8902bfcc9dc7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=60), nullable=False),
    sa.Column('username', sa.String(length=10), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.Column('email', sa.String(length=60), nullable=False),
    sa.Column('credit_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.CheckConstraint('name != username', name=op.f('ck_customers_check_name_not_username')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_customers')),
    sa.UniqueConstraint('email', name=op.f('uq_customers_email')),
    sa.UniqueConstraint('username', name=op.f('uq_customers_username'))
    )
    op.create_table('shipments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=250), nullable=False),
    sa.Column('vessel_name', sa.String(length=30), nullable=False),
    sa.Column('departure_time', sa.DateTime(), nullable=False),
    sa.Column('arrival_time', sa.DateTime(), nullable=False),
    sa.Column('arrival_port', sa.String(length=30), nullable=False),
    sa.Column('origin', sa.String(length=30), nullable=False),
    sa.Column('freight_rate', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.CheckConstraint('arrival_time != departure_time', name=op.f('ck_shipments_check_arrival_and_departure_date')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_shipments'))
    )
    op.create_table('containers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('container_number', sa.String(length=10), nullable=False),
    sa.Column('container_type', sa.String(), nullable=False),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.Column('shipment_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], name=op.f('fk_containers_customer_id_customers')),
    sa.ForeignKeyConstraint(['shipment_id'], ['shipments.id'], name=op.f('fk_containers_shipment_id_shipments')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_containers')),
    sa.UniqueConstraint('container_number', name=op.f('uq_containers_container_number'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('containers')
    op.drop_table('shipments')
    op.drop_table('customers')
    # ### end Alembic commands ###
