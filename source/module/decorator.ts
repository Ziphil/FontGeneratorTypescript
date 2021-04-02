//

import "reflect-metadata";
import {
  Generator
} from "./generator";
import {
  Glyph
} from "./glyph";
import {
  Part
} from "./part";


const KEY = Symbol("key");

type Metadata = Map<string, string | symbol>;

type GeneratorDecorator = (clazz: new(...args: any) => Generator) => void;
type GlyphMethodDecorator = (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<GlyphMethod>) => void;
type PartMethodDecorator = (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<PartMethod>) => void;
type GlyphMethod = () => Glyph;
type PartMethod = () => Part;

export function generator(): GeneratorDecorator {
  let decorator = function (clazz: new(...args: any) => Generator): void {
    let metadata = Reflect.getMetadata(KEY, clazz.prototype) as Metadata;
    clazz.prototype.getChars = function (this: Generator): Array<string> {
      let chars = Array.from(metadata.keys());
      return chars;
    };
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
    cacheGetters(clazz);
  };
  return decorator;
}

export function glyph(...chars: Array<string>): GlyphMethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<GlyphMethod>): void {
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

export function part(): PartMethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<PartMethod>): void {
    let original = descriptor.value!;
    descriptor.value = function (this: Generator): Part {
      let cachedPart = this.partCache.get(name);
      if (cachedPart === undefined) {
        let part = original.apply(this);
        this.partCache.set(name, part.clone());
        return part;
      } else {
        return cachedPart.clone();
      }
    };
  };
  return decorator;
}

function cacheGetters(clazz: new(...args: any) => Generator): void {
  let descriptors = Object.getOwnPropertyDescriptors(clazz.prototype);
  for (let [name, descriptor] of Object.entries(descriptors)) {
    if (typeof descriptor.get === "function") {
      let original = descriptor.get;
      descriptor.get = function (this: Generator): any {
        let cachedValue = this.getterCache.get(name);
        if (cachedValue === undefined) {
          let value = original.apply(this);
          if (typeof value === "number") {
            this.getterCache.set(name, value);
          }
          return value;
        } else {
          return cachedValue;
        }
      };
      Object.defineProperty(clazz.prototype, name, descriptor);
    }
  }
}