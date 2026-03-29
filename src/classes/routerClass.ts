import { Router } from 'express';

export abstract class RouterClass {
    router: Router;

    protected constructor() {
        this.router = Router();
        this.define();
    }

    public define(): void {}
}
