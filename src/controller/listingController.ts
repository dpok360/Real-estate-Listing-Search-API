import {Request, Response} from 'express';
import {ListingService} from '@src/services';
import {Pagination} from '@src/helpers/pagination';
import {HttpStatusEnum, SortEnum} from '@src/enums';
import {PropertyType, ListingStatus} from '@src/enums/propertyEnum';
import {ArgsPropertyInterface} from '@src/interfaces';
import {defaultOffsetOrder, defaultSort, pgMaxLimit, pgMinLimit} from '@src/config';

export class ListingsController {
    public static async lists(req: Request, res: Response): Promise<Response> {
        let {
            page, limit, order, sort,
            suburb, price_min, price_max,
            bedrooms, bathrooms, property_type,
            keyword, listing_status,
        } = req.query as Record<string, string>;

        const parsedPage = Number(page) > 0 ? Number(page) : 1;
        let parsedLimit = Number(limit) > 0 ? Number(limit) : pgMinLimit;
        parsedLimit = Math.min(parsedLimit, pgMaxLimit);
        const parsedOrder = order ?? defaultOffsetOrder;
        const parsedSort = (sort as SortEnum) ?? defaultSort;
        const offset = (parsedPage - 1) * parsedLimit;

        const args: ArgsPropertyInterface = {
            offset,
            limit: parsedLimit,
            order: parsedOrder,
            sort: parsedSort,
            suburb: suburb ?? undefined,
            priceMin: price_min ? parseFloat(price_min) : undefined,
            priceMax: price_max ? parseFloat(price_max) : undefined,
            bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
            bathrooms: bathrooms ? parseInt(bathrooms, 10) : undefined,
            propertyType: (property_type as PropertyType) ?? undefined,
            keyword: keyword ?? undefined,
            listingStatus: (listing_status as ListingStatus) ?? undefined,
        };

        const {count, rows: data} = await new ListingService().list(args, req.isAdmin);

        const pageInfo = Pagination.getPageInfo({
            total: count,
            count: data.length,
            limit: parsedLimit,
            page: parsedPage,
        });

        return res.status(HttpStatusEnum.OK).json({message: 'Listings fetched successfully', data, pageInfo});
    }

    public static async listById(req: Request, res: Response): Promise<Response> {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: 'Invalid listing id — must be an integer.',
            });
        }

        const listing = await new ListingService().findById(id, req.isAdmin);
        return res.status(HttpStatusEnum.OK).json({message: 'Listing fetched successfully', data: listing});
    }
}
