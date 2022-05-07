import convict from  'convict';
import validator from 'convict-format-with-validator';


convict.addFormats(validator);

type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
};

const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address for the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_PORT: {
    doc: 'Port to connect for the database server',
    format: 'port',
    env: 'DB_PORT',
    default: 27017
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
});


export {ConfigSchema, configSchema};
