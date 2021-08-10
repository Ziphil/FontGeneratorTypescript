//


export class MathUtil {

  public static sinDeg(degree: number): number {
    return Math.sin(degree * Math.PI / 180);
  }

  public static cosDeg(degree: number): number {
    return Math.cos(degree * Math.PI / 180);
  }

  public static tanDeg(degree: number): number {
    return Math.tan(degree * Math.PI / 180);
  }

  public static atanDeg(value: number): number {
    return Math.atan(value) * 180 / Math.PI;
  }

  public static atan2Deg(y: number, x: number): number {
    return Math.atan2(y, x) * 180 / Math.PI;
  }

}