import {plainToInstance, ClassConstructor} from 'class-transformer';


const fillDTO = <T, U>(DTO: ClassConstructor<T>, plainObject: U) => (
  plainToInstance(DTO, plainObject, {excludeExtraneousValues: true})
);


const createErrorObject = (message: string) => ({error: message});


export {createErrorObject, fillDTO};
