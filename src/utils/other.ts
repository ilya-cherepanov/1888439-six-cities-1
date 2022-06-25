import {plainToInstance, ClassConstructor} from 'class-transformer';


const fillDTO = <T, U>(DTO: ClassConstructor<T>, plainObject: U) => (
  plainToInstance(DTO, plainObject, {excludeExtraneousValues: true})
);


const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;


export {fillDTO, getFullServerPath};
