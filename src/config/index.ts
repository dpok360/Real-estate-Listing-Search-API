import * as dotenv from 'dotenv';
import * as sequelize from 'sequelize';
import { EnvironmentEnum, SortEnum } from '@src/enums';

const mustExist = <T>(value: T | undefined, name: string): T => {
    if (!value) {
        console.error(`Missing Config: ${name} !!!`);
        process.exit(1);
    }
    return value;
};

dotenv.config();

export const port = mustExist(+process.env.APP_PORT!, 'APP_PORT') as number,
    appName = mustExist(process.env.APP_NAME!, 'APP_NAME') as string,
    environment = process.env.ENVIRONMENT || (EnvironmentEnum.DEVELOPMENT as EnvironmentEnum),
    hostUrl = mustExist(process.env.APP_HOST_URL!, 'APP_HOST_URL') as string,
    appUrl = mustExist(process.env.APP_URL!, 'APP_URL') as string,
    db = {
        username: mustExist(process.env.DB_USER!, 'DB_USER'),
        password: process.env.DB_PASSWORD!,
        name: mustExist(process.env.DB_NAME!, 'DB_NAME'),
        host: mustExist(process.env.DB_HOST!, 'DB_HOST'),
        dialect: mustExist(process.env.DB_DIALECT!, 'DB_DIALECT'),
        port: mustExist(+process.env.DB_PORT!, 'DB_PORT'),
        logging: false,
        timezone: 'utc',
    } as {
        username: string;
        password: string;
        name: string;
        host: string;
        dialect: sequelize.Dialect;
        port: number;
        logging: boolean;
        timezone: string;
    },
    // cors
    corsWhitelist: string[] = process.env.CORS_WHITE_LIST!.split(','),
    // pagination
    pgMinLimit = 10,
    pgMaxLimit = 100,
    defaultSort = SortEnum.DESC,
    defaultOffsetOrder = 'id'

export * from './instance';
