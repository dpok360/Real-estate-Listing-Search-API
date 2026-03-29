'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('properties', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            agent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'agents',
                    key: 'id'
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
            address_line: {
                type: Sequelize.STRING(200),
                allowNull: false,
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
            property_type: {
                type: Sequelize.ENUM('house', 'apartment', 'townhouse', 'land', 'commercial', 'rural'),
                allowNull: false,
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
            car_spaces: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            land_area_sqm: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            floor_area_sqm: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            listing_status: {
                type: Sequelize.ENUM('active', 'under_offer', 'sold', 'leased', 'withdrawn'),
                allowNull: false,
                defaultValue: 'active',
            },
            internal_status_notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            listed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex('properties', ['suburb', 'price', 'property_type', 'bedrooms', 'bathrooms'], {
            name: 'properties_suburb_price_property_type_bedrooms_bathrooms',
        });

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('properties', 'properties_suburb_price_property_type_bedrooms_bathrooms');
        await queryInterface.dropTable('properties');
    }
};
