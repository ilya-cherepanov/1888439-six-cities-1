import convict from  'convict';
import validator from 'convict-format-with-validator';


convict.addFormats(validator);

type ConfigSchema = {
  HOST: string;
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  UPLOAD_FILE_DIRECTORY: string;
  STATIC_FILE_PATH: string;
  JWT_SECRET: string;
};

const configSchema = convict<ConfigSchema>({
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
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
    doc: 'Database password',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  UPLOAD_FILE_DIRECTORY: {
    doc: 'Directory for uploading files',
    format: String,
    env: 'UPLOAD_FILE_DIRECTORY',
    default: 'upload',
  },
  STATIC_FILE_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_FILE_PATH',
    default: 'static'
  },
  JWT_SECRET: {
    doc: 'Secret for JWT tokens',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
});


export {ConfigSchema, configSchema};
