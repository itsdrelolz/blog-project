import { TokenPayload } from '@blog-project/shared-types/types/auth';

declare global {
  namespace Express {
    interface User extends TokenPayload {}
  }
} 