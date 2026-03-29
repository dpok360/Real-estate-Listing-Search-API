import { Request, Response, NextFunction } from 'express';
import { AgentRepository } from '@src/repositories';

declare global {
  namespace Express {
    interface Request {
      isAdmin: boolean;
    }
  }
}

export const roleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  req.isAdmin = false;
  const agentIdHeader = req.headers['x-agent-id'];
  if (agentIdHeader) {
    const agentId = parseInt(agentIdHeader as string, 10);
    if (!isNaN(agentId)) {
      const agent = await new AgentRepository().findOne({ where: { id: agentId } });
      if (agent?.isAdmin) req.isAdmin = true;
    }
  }
  next();
};
