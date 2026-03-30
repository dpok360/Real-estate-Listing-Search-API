import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, PaginationOrderSearchExtend } from '.';
import { PropertyType, ListingStatus } from '@src/enums/propertyEnum';

export interface InputPropertyInterface {
    agentId?: number;
    title: string;
    description?: string;
    addressLine: string;
    suburb: string;
    state: string;
    postcode: string;
    price: number;
    propertyType: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    carSpaces?: number;
    landAreaSqm?: number;
    floorAreaSqm?: number;
    listingStatus?: ListingStatus;
    internalStatusNotes?: string;
    listedAt?: Date;
    imageUrl?: string;
}

export interface PropertyInterface extends InputPropertyInterface, ModelTimestampExtend {
    id: Sequelize.CreationOptional<number>;
}

export interface ArgsPropertyInterface extends PaginationOrderSearchExtend {
    suburb?: string;
    priceMin?: number;
    priceMax?: number;
    propertyType?: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    keyword?: string;
    listingStatus?: ListingStatus;
}

export interface PropertyModelInterface
    extends Sequelize.Model<PropertyInterface, Partial<InputPropertyInterface>>,
        PropertyInterface {}