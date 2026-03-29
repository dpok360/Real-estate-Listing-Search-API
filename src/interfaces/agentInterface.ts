import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';

export interface InputAgentInterface {
    fullName: string;
    email: string;
    phone?: string;
    licenseNumber?: string;
    isAdmin?: boolean;
}

export interface AgentInterface
    extends InputAgentInterface,
        ModelTimestampExtend {
    id: Sequelize.CreationOptional<number>;
}

export interface AgentModelInterface
    extends Sequelize.Model<
        AgentInterface,
        Partial<InputAgentInterface>
    >,
        AgentInterface {}