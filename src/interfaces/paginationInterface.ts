import { SortEnum } from '@src/enums';

export interface PaginationExtend {
    offset?: number;
    limit: number;
    page?: number;
}

export interface OrderExtend {
    sort: SortEnum;
    order: string;
}

export interface SearchExtend {
    query?: string;
}

export interface DateRangeExtend {
    fromDate?: Date;
    toDate?: Date;
}

export interface PaginationOrderSearchExtend
    extends PaginationExtend,
        OrderExtend,
        SearchExtend,
        DateRangeExtend {}

export interface PageInfoInterface {
    count: number;
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    links?: {
        previous: string;
        next: string;
    };
}
