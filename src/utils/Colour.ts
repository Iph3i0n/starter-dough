import { IsNumber, IsString, IsTuple } from "@paulpopat/safe-type";

const IsRgb = IsTuple(IsNumber, IsNumber, IsNumber);
const IsRgba = IsTuple(IsNumber, IsNumber, IsNumber, IsNumber);

export default class Colour {
  private readonly r: number;
  private readonly g: number;
  private readonly b: number;
  private readonly a: number;

  public constructor(
    colour: string | [number, number, number] | [number, number, number, number]
  ) {
    if (IsString(colour)) {
      if (colour.match(/^\#[0-9a-f][0-9a-f][0-9a-f]$/gm)) {
        this.r = parseInt(colour[1], 16) * 16;
        this.g = parseInt(colour[2], 16) * 16;
        this.b = parseInt(colour[3], 16) * 16;
        this.a = 1;
      } else if (
        colour.match(/^\#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/gm)
      ) {
        this.r = parseInt(colour[1] + colour[2], 16);
        this.g = parseInt(colour[3] + colour[4], 16);
        this.b = parseInt(colour[5] + colour[6], 16);
        this.a = 1;
      } else {
        throw new Error("Invalid hex colour of " + colour);
      }
    } else if (IsRgb(colour)) {
      this.r = colour[0];
      this.g = colour[1];
      this.b = colour[2];
      this.a = 1;
    } else if (IsRgba(colour)) {
      this.r = colour[0];
      this.g = colour[1];
      this.b = colour[2];
      this.a = colour[3];
    } else {
      throw new Error("Invalid hex colour of " + colour);
    }
  }

  public get Hex() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  public get Text() {
    const brightness = Math.round(
      (this.r * 299 + this.g * 587 + this.b * 114) / 1000
    );

    return brightness > 125 ? "dark" : ("light" as const);
  }

  public GreyscaleTransform(amount: number) {
    return new Colour([
      this.r * (amount / 100),
      this.g * (amount / 100),
      this.b * (amount / 100),
    ]);
  }

  public toString() {
    return this.Hex;
  }
}

export function IsColour(arg: any): arg is Colour {
  return arg instanceof Colour;
}

(window as any).Colour = Colour;
