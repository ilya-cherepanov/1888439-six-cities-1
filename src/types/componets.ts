export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserModel: Symbol.for('UserModel'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
} as const;
