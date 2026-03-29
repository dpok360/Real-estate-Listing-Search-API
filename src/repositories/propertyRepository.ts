import {InputPropertyInterface, PropertyInterface} from '@src/interfaces';
import {BaseRepository} from '@src/repositories/baseRepository';
import Model from '@src/models';

export class PropertyRepository extends BaseRepository<InputPropertyInterface, PropertyInterface> {
    constructor() {
        super(Model.Property);
    }
}
