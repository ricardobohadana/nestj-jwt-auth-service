export class UserPersistentToken {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  lastUsedAt: Date;
  isExpired: boolean;
}
