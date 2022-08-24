import { Request } from '@nestjs/common';

interface User {
  userId: number;
}

export interface IRequest extends Request {
  user: User;
}
