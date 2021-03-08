//

import "reflect-metadata";
import {
  Generator
} from "./generator";
import {
  Glyph
} from "./glyph";


const KEY = Symbol("key");

type Metadata = Map<string, string | symbol>;
type GeneratorDecorator = (clazz: new(config: never) => Generator) => void;

export function generator(): GeneratorDecorator {
  let decorator = function (clazz: new(config: never) => Generator): void {
    let metadata = Reflect.getMetadata(KEY, clazz.prototype) as Metadata;
    clazz.prototype.glyph = function (this: Generator, char: string): Glyph | null {
      let anyThis = this as any;
      let name = metadata.get(char);
      if (name !== undefined) {
        let glyph = anyThis[name]();
        return glyph;
      } else {
        return null;
      }
    };
  };
  return decorator;
}

export function glyph(...chars: Array<string>): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    let metadata = Reflect.getMetadata(KEY, target) as Metadata;
    if (!metadata) {
      metadata = new Map();;
      Reflect.defineMetadata(KEY, metadata, target);
    }
    for (let char of chars) {
      metadata.set(char, name);
    }
  };
  return decorator;
}

export function part(): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
  };
  return decorator;
}