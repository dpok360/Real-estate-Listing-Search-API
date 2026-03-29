import { Router } from 'express';
import { IRouteInterface } from '@src/interfaces';
import {ListingRoutes} from "@src/routes/v1/listingRoutes";

class ProxyRouterUser {
    private static instance: ProxyRouterUser;
    private router: Router = Router();

    private readonly routes = [
        {
            segment: '/listings',
            provider: ListingRoutes,
        },
    ];

    private constructor() {}

    public static get(): ProxyRouterUser {
        if (!ProxyRouterUser.instance) ProxyRouterUser.instance = new ProxyRouterUser();
        return ProxyRouterUser.instance;
    }

    public map(): Router {
        this.routes.forEach((route: IRouteInterface) => {
            const instance = new route.provider() as { router: Router };
            this.router.use(route.segment, instance.router);
        });

        return this.router;
    }
}

const proxyRouterUser = ProxyRouterUser.get();
export { proxyRouterUser as ProxyRouterUser };
