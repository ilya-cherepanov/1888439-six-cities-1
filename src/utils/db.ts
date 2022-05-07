const createURI = (
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${username}`;


export {createURI};
