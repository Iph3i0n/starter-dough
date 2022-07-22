import {
  PatternMatch,
  IsString,
  IsTuple,
  IsUnion,
  IsLiteral,
  IsType,
} from "@paulpopat/safe-type";

export abstract class CssProperty {
  public abstract get Properties(): { name: string; value: string }[];

  public toString() {
    return this.Properties.map((r) => `${r.name}:${r.value};`).join("");
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

  public toString(): string {
    return (
      `${this.selector}{${this.properties.map((p) => p.toString()).join("")}}` +
      this.rules
        .map(([mode, rule]) =>
          new Rule(
            this.BuildSelector(this.selector, rule.selector, mode),
            rule.rules,
            rule.properties
          ).toString()
        )
        .join("")
    );
  }

  public static Init(selector: string) {
    return new Rule(selector, [], []);
  }

  public With(name: string, value: string): Rule;
  public With(property: CssProperty): Rule;
  public With(mode: RuleMode, rule: Rule): Rule;
  public With(...args: [RuleMode, Rule] | [string, string] | [CssProperty]) {
    return PatternMatch(
      IsTuple(IsString, IsString),
      IsTuple(IsCssProperty),
      IsTuple(IsRuleMode, IsRule)
    )(
      ([name, value]) =>
        new Rule(this.selector, this.rules, [
          ...this.properties,
          new Property(name, value),
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

export class Media {
  private readonly rules: Rule[];
  private constructor(private readonly query: string, ...rules: Rule[]) {
    this.rules = rules;
  }

  public toString() {
    return `@media screen and (${this.query}){${this.rules
      .map((r) => r.toString())
      .join("")}}`;
  }

  public With(chunk: Rule) {
    return new Media(this.query, ...[...this.rules, chunk]);
  }

  public static Init(query: string) {
    return new Media(query);
  }
}

export class Keyframes {
  private readonly rules: Rule[];
  private constructor(private readonly name: string, ...rules: Rule[]) {
    this.rules = rules;
  }

  public toString() {
    return `@keyframes (${this.name}){${this.rules
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

type CssChunk = Rule | Media | Keyframes;

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
