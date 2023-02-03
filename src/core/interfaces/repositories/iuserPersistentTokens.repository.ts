export abstract class IUserPersistentTokensRepository {
  /**
   * Insert a single token in the database
   * @param data the target data to be inserted in the database
   */
  abstract insertToken(data: { userId: string; token: string }): Promise<void>;

  /**
   * Sets a specific token as expired in the database
   * @param token the target token to be set as expired in the database
   */
  abstract setTokenAsExpired(token: string): Promise<void>;

  /**
   * Checks if the given token exists in the database and if it is expired
   * @param token the target token
   * @returns `false` if tokens exists and is not expired, `true` otherwise
   */
  abstract checkIfTokenIsExpired(token: string): Promise<boolean>;

  /**
   * Remove all existing expired tokens from the database
   * @returns the amount of expired tokens removed from the database
   */
  abstract removeExpiredTokens(): Promise<number>;
}
