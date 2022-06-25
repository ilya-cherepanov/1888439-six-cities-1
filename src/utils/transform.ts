import {ValidationError} from 'class-validator';
import {AVATARS} from '../consts.js';
import {UnknownObject} from '../types/unknown-object.type.js';
import {ValidationErrorField} from '../types/validation-error-field.type.js';


const isObject = (value: unknown): value is UnknownObject => typeof value === 'object' && value !== null;


const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void,
): void => Object.keys(someObject).forEach((key) => {
  if (key === property && someObject[key] !== undefined) {
    transformFn(someObject);
  } else if (isObject(someObject[key])) {
    transformProperty(property, someObject[key] as UnknownObject, transformFn);
  }
});


const transformObject = (properties: string[], staticPath: string, uploadPath: string, data: UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const staticImages = [...AVATARS];
      const rootPath = staticImages.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};


const transformErrors = (errors: ValidationError[]): ValidationErrorField[] => (
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }))
);


export {transformProperty, transformObject, transformErrors};
