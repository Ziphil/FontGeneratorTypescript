//

import "reflect-metadata";
import {
  Generator
} from "./generator";
import {
  Glyph
} from "./glyph";
import {
  Contour,
  Part
} from "./part";


const KEY = Symbol("key");

type Metadata = Map<string, string | symbol>;

type GeneratorDecorator = (clazz: new(...args: any) => Generator) => void;
type GlyphMethodDecorator = (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<GlyphMethod>) => void;
type PartMethodDecorator = (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<PartMethod> | TypedPropertyDescriptor<ContourMethod>) => void;
type GlyphMethod = () => Glyph;
type PartMethod = (...args: Array<any>) => Part;
type ContourMethod = (...args: Array<any>) => Contour;

export function generator(): GeneratorDecorator {
  const decorator = function (clazz: new(...args: any) => Generator): void {
    const metadata = Reflect.getMetadata(KEY, clazz.prototype) ?? new Map() as Metadata;
    clazz.prototype.chars = Array.from(metadata.keys());
    clazz.prototype.glyph = function (this: Generator, char: string): Glyph | null {
      const anyThis = this as any;
      const name = metadata.get(char);
      if (name !== undefined) {
        const glyph = anyThis[name]();
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
  const decorator = function (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<GlyphMethod>): void {
    let metadata = Reflect.getMetadata(KEY, target) as Metadata;
    if (!metadata) {
      metadata = new Map();
      Reflect.defineMetadata(KEY, metadata, target);
    }
    for (const char of chars) {
      metadata.set(char, name);
    }
  };
  return decorator;
}

export function part(): PartMethodDecorator {
  const decorator = function (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<PartMethod> | TypedPropertyDescriptor<ContourMethod>): void {
    const original = descriptor.value! as any;
    descriptor.value = function (this: Generator, ...args: Array<any>): any {
      if (args.length === 0) {
        const cachedPart = this.partCache.get(name);
        if (cachedPart === undefined) {
          const part = original.call(this, ...args);
          this.partCache.set(name, part.clone());
          return part;
        } else {
          return cachedPart.clone();
        }
      } else {
        return original.call(this, ...args);
      }
    };
  };
  return decorator;
}

function cacheGetters(clazz: new(...args: any) => Generator): void {
  const descriptors = Object.getOwnPropertyDescriptors(clazz.prototype);
  for (const [name, descriptor] of Object.entries(descriptors)) {
    if (typeof descriptor.get === "function") {
      const original = descriptor.get;
      descriptor.get = function (this: Generator): any {
        const cachedValue = this.getterCache.get(name);
        if (cachedValue === undefined) {
          const value = original.apply(this);
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