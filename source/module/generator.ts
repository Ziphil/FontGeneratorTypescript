//


export class Generator<C = unknown> {

  protected config: C;

  public constructor(config: C) {
    this.config = config;
  }

}