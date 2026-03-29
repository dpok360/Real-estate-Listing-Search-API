import * as Sequelize from 'sequelize';
import { Database } from '@src/config';
import { AgentModelInterface } from '@src/interfaces';

const sequelize = Database.sequelize;

const Agent = sequelize.define<AgentModelInterface>(
    'agents',
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        fullName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'full_name',
        },

        email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        phone: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },

        licenseNumber: {
            type: Sequelize.STRING(50),
            allowNull: true,
            field: 'license_number',
        },

        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_admin',
        },
    },
    {
        timestamps: true,
        paranoid: true,
        underscored: true,
    },
);

export default Agent;