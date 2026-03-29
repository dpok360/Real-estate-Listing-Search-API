import * as Sequelize from 'sequelize';
import { Database } from '@src/config';
import { PropertyModelInterface } from '@src/interfaces';
import { PropertyType, ListingStatus } from '@src/enums/propertyEnum';
import Agent from './agent';

const sequelize = Database.sequelize;

const Property = sequelize.define<PropertyModelInterface>(
    'properties',
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        agentId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'agent_id',
            references: {
                model: 'agents',
                key: 'id',
            },
        },

        title: {
            type: Sequelize.STRING(200),
            allowNull: false,
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        addressLine: {
            type: Sequelize.STRING(200),
            allowNull: false,
            field: 'address_line',
        },

        suburb: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },

        state: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },

        postcode: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },

        price: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: false,
        },

        propertyType: {
            type: Sequelize.ENUM(...Object.values(PropertyType)),
            allowNull: false,
            field: 'property_type',
        },

        bedrooms: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        bathrooms: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        carSpaces: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'car_spaces',
        },

        landAreaSqm: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            field: 'land_area_sqm',
        },

        floorAreaSqm: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            field: 'floor_area_sqm',
        },

        listingStatus: {
            type: Sequelize.ENUM(...Object.values(ListingStatus)),
            allowNull: false,
            defaultValue: ListingStatus.ACTIVE,
            field: 'listing_status',
        },

        internalStatusNotes: {
            type: Sequelize.TEXT,
            allowNull: true,
            field: 'internal_status_notes',
        },

        listedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'listed_at',
        },
    },
    {
        timestamps: true,
        paranoid: true,
        underscored: true,
    },
);

Property.belongsTo(Agent, {
    foreignKey: 'agentId',
    as: 'agent',
});

export default Property;