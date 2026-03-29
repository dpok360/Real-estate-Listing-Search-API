import { exceptionHandler, roleMiddleware } from '@src/middlewares';
import { RouterClass } from '@src/classes';
import { ListingsController } from '@src/controller';

export class ListingRoutes extends RouterClass {
  constructor() {
    super();
  }

  override define(): void {
    this.router
      .route('/')
      .get(
        exceptionHandler(roleMiddleware),
        exceptionHandler(ListingsController.lists),
      );

    this.router
      .route('/:id')
      .get(
        exceptionHandler(roleMiddleware),
        exceptionHandler(ListingsController.listById),
      );
  }
}
