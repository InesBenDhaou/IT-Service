import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import validator from 'validator';

export function IsNonEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNonEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a non-empty string`;
        },
      },
    });
  };
}

export function IsNonEmptyEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isNonEmptyEmail',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            return typeof value === 'string' && validator.isEmail(value);
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} doit être une adresse email valide et non vide`;
          },
        },
      });
    };
  }

  export function IsStringAndLength(minLength: number, maxLength: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isStringAndLength',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (typeof value !== 'string') {
              return false;
            }
            return value.length >= minLength && value.length <= maxLength;
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} doit être une chaîne de caractères d'une longueur comprise entre ${minLength} et ${maxLength}`;
          },
        },
      });
    };
  }