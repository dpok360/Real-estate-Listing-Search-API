import 'module-alias/register';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import http from 'http';
import { corsWhitelist, Database, port } from '@src/config';
import * as errorHandler from '@src/middlewares/errorHandler';
import {ProxyRouterUser} from "@src/routes/v1/index";


class Server {
    public app: express.Application;

    public constructor() {
        this.app = express();
    }

    private async connectDB() {
        await Database.connection();
    }

    public async start() {
        await this.connectDB();
        this.configuration();

        this.app.use('/api/v1', ProxyRouterUser.map());

        this.app.use(errorHandler.genericErrorHandler);
        this.app.use(errorHandler.notFound);

        const httpServer = http.createServer(this.app);
        await new Promise<void>((resolve) => {
            httpServer.listen(this.app.get('port'), resolve);
            console.info(`Server ready at http://localhost:${this.app.get('port')}`);
        });
    }

    private corsOptions: CorsOptions = {
        origin: function (origin: string | undefined, callback) {
            if (!origin || corsWhitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200,
        credentials: true,
    };

    private configuration() {
        this.app.set('port', port);
        this.app.use(cors(this.corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
}

const server = new Server();
server.start();
