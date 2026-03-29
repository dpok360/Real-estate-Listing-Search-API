import {Op, WhereOptions} from 'sequelize';
import Model from '@src/models';
import {ArgsPropertyInterface, PropertyInterface} from '@src/interfaces';
import {PropertyRepository} from '@src/repositories';
import {HttpError} from '@src/helpers/httpError';

export class ListingService {
    private propertyRepository: PropertyRepository;

    constructor() {
        this.propertyRepository = new PropertyRepository();
    }

    public async list(
        args: ArgsPropertyInterface,
        isAdmin: boolean,
    ): Promise<{ count: number; rows: Partial<PropertyInterface>[] }> {
        let where: WhereOptions = {};

        if (args.suburb)
            where = {...where, suburb: {[Op.iLike]: `%${args.suburb}%`}};

        if (args.priceMin)
            where = {...where, price: {[Op.gte]: args.priceMin}};

        if (args.priceMax)
            where = {...where, price: {[Op.lte]: args.priceMax}};

        if (args.bedrooms !== undefined)
            where = {...where, bedrooms: {[Op.gte]: args.bedrooms}};

        if (args.bathrooms !== undefined)
            where = {...where, bathrooms: {[Op.gte]: args.bathrooms}};

        if (args.propertyType)
            where = {...where, propertyType: args.propertyType};

        if (args.listingStatus)
            where = {...where, listingStatus: args.listingStatus};

        if (args.keyword)
            where = {
                ...where,
                [Op.or]: [
                    {title: {[Op.iLike]: `%${args.keyword}%`}},
                    {description: {[Op.iLike]: `%${args.keyword}%`}},
                ],
            };

        const {count, rows} = await this.propertyRepository.findAndCountAll({
            where,
            include: [{model: Model.Agent, as: 'agent'}],
            order: [[args.order, args.sort]],
            offset: args.offset,
            limit: args.limit,
            distinct: true,
        });

        const data = isAdmin ? rows : rows.map(stripInternal);
        return {count, rows: data};
    }

    public async findById(
        id: number,
        isAdmin: boolean,
    ): Promise<Partial<PropertyInterface>> {
        const propertyExist = await this.propertyRepository.findByPk(id, {
            include: [{model: Model.Agent, as: 'agent'}],
        });
        if (!propertyExist) throw HttpError.notFound(`Property with id: ${id} doesn't exist`);
        return isAdmin ? propertyExist : stripInternal(propertyExist);
    }
}

function stripInternal(listing: PropertyInterface): Partial<PropertyInterface> {
    const plain =
        listing instanceof Object && 'get' in listing
            ? (listing as any).get({plain: true})
            : listing;
    const {internalStatusNotes, ...rest} = plain;
    return rest;
}
