import Model from '@src/models';
import { BaseRepository } from '@src/repositories/baseRepository';
import {AgentInterface, InputAgentInterface} from '@src/interfaces';

export class AgentRepository extends BaseRepository<
    InputAgentInterface,
    AgentInterface
> {
    constructor() {
        super(Model.Agent);
    }
}
