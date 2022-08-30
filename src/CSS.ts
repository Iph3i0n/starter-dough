import {
  PatternMatch,
  IsString,
  IsTuple,
  IsUnion,
  IsLiteral,
  IsType,
} from "@paulpopat/safe-type";
import Array from "./utils/Array";

type CssModel = {
  selector: string;
  name: string;
  value: string;
  media?: string;
}[];

type PropertyModel = {
  name: string;
  value: string;
  media?: string;
};

export abstract class CssProperty {
  public abstract get Properties(): PropertyModel[];

  public WithMedia(test: string, value: string) {
    return new ExtendedProperties(this.Properties, `${test}:${value}`);
  }
}

class ExtendedProperties extends CssProperty {
  public constructor(
    private readonly properties: PropertyModel[],
    private readonly media: string
  ) {
    super();
  }

  public override get Properties(): PropertyModel[] {
    return this.properties.map((p) => ({ ...p, media: this.media }));
  }
}

function IsCssProperty(arg: any): arg is CssProperty {
  return arg instanceof CssProperty;
}

class Property extends CssProperty {
  public constructor(
    private readonly name: string,
    private readonly value: string
  ) {
    super();
  }

  public override get Properties() {
    return [{ name: this.name, value: this.value }];
  }
}

class MediaProperty extends CssProperty {
  public constructor(
    private readonly name: string,
    private readonly value: string,
    private readonly query: string
  ) {
    super();
  }

  public override get Properties() {
    return [{ name: this.name, value: this.value, media: this.query }];
  }
}

const IsRuleMode = IsUnion(IsLiteral("modifier"), IsLiteral("child"));
type RuleMode = IsType<typeof IsRuleMode>;

export class Rule {
  private constructor(
    private readonly selector: string,
    private readonly rules: [RuleMode, Rule][],
    private readonly properties: CssProperty[]
  ) {}

  private BuildSelector(base: string, add: string, mode: RuleMode) {
    const base_parts = base.split(",").map((p) => p.trim());
    const add_parts = add.split(",").map((p) => p.trim());
    const result: string[] = [];
    for (const base_part of base_parts) {
      for (const add_part of add_parts) {
        result.push(base_part + (mode === "child" ? " " : "") + add_part);
      }
    }

    return result.join(",");
  }

  public get Model(): CssModel {
    return [
      ...this.properties
        .flatMap((p) => p.Properties)
        .map((p) => ({ ...p, selector: this.selector })),
      ...this.rules.flatMap(([mode, r]) =>
        r.Model.map((p) => ({
          ...p,
          selector: this.BuildSelector(this.selector, p.selector, mode),
        }))
      ),
    ];
  }

  public toString(): string {
    return Array.GroupBy(this.Model, (i) => i.media)
      .map(
        ([query, properties]) =>
          [
            query,
            Array.GroupBy(properties, (i) => i.selector)
              .map(
                ([selector, properties]) =>
                  `${selector}{${properties
                    .map((p) => `${p.name}:${p.value}`)
                    .join(";")}}`
              )
              .join(""),
          ] as const
      )
      .map(([query, css]) =>
        query ? `@media screen and (${query}){${css}}` : css
      )
      .join("");
  }

  public static Init(selector: string) {
    return new Rule(selector, [], []);
  }

  public With(name: string, value: string): Rule;
  public With(name: string, value: string, media: string): Rule;
  public With(property: CssProperty): Rule;
  public With(mode: RuleMode, rule: Rule): Rule;
  public With(
    ...args:
      | [RuleMode, Rule]
      | [string, string]
      | [string, string, string]
      | [CssProperty]
  ) {
    return PatternMatch(
      IsTuple(IsString, IsString),
      IsTuple(IsString, IsString, IsString),
      IsTuple(IsCssProperty),
      IsTuple(IsRuleMode, IsRule)
    )(
      ([name, value]) =>
        new Rule(this.selector, this.rules, [
          ...this.properties,
          new Property(name, value),
        ]),
      ([name, value, media]) =>
        new Rule(this.selector, this.rules, [
          ...this.properties,
          new MediaProperty(name, value, media),
        ]),
      ([property]) =>
        new Rule(this.selector, this.rules, [...this.properties, property]),
      ([mode, rule]) =>
        new Rule(this.selector, [...this.rules, [mode, rule]], this.properties)
    )(args);
  }
}

function IsRule(item: any): item is Rule {
  return item instanceof Rule;
}

export class Keyframes {
  private readonly rules: Rule[];
  private constructor(private readonly name: string, ...rules: Rule[]) {
    this.rules = rules;
  }

  public toString() {
    return `@keyframes ${this.name}{${this.rules
      .map((r) => r.toString())
      .join("")}}`;
  }

  public With(chunk: Rule) {
    return new Keyframes(this.name, ...[...this.rules, chunk]);
  }

  public static Init(name: string) {
    return new Keyframes(name);
  }
}

export type CssChunk = Rule | Keyframes | string;

export default class Css {
  private readonly content: CssChunk[];
  private constructor(...content: CssChunk[]) {
    this.content = content;
  }

  public toString() {
    return this.content.map((c) => c.toString()).join("");
  }

  public With(chunk: CssChunk) {
    return new Css(...[...this.content, chunk]);
  }

  public static Init() {
    return new Css();
  }
}
