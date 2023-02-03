import 'passport';
import { User } from '../src/core/models/entities/User';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
