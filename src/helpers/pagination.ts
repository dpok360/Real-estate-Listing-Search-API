import {defaultOffsetOrder, defaultSort, pgMaxLimit, pgMinLimit} from '@src/config';
import {PageInfoInterface, PaginationOrderSearchExtend} from '@src/interfaces';

class Pagination {
    private static instance: Pagination;

    private constructor() {
    }

    static get(): Pagination {
        if (!Pagination.instance) {
            Pagination.instance = new Pagination();
        }

        return Pagination.instance;
    }

    public getQuery({
                        page,
                        limit,
                        query,
                        sort,
                        order,
                    }: PaginationOrderSearchExtend): PaginationOrderSearchExtend {
        page = page && page > 0 ? page : 1;
        limit = limit && limit > 0 ? limit : pgMinLimit;
        limit = Math.min(limit, pgMaxLimit);
        query = query ?? undefined;
        order = order ?? defaultOffsetOrder;
        sort = sort ?? defaultSort;
        const offset = (page - 1) * limit;

        return {
            page,
            offset,
            limit,
            query,
            order,
            sort,
        };
    }

    public getPageInfo({
                           total,
                           count,
                           limit,
                           page,
                       }: {
        total: number;
        count: number;
        limit: number;
        page: number;
    }): PageInfoInterface {
        const totalPages = Math.ceil(total / limit);

        return {
            count,
            total,
            limit,
            currentPage: page,
            totalPages,
        };
    }
}

const pagination = Pagination.get();
export {pagination as Pagination};
