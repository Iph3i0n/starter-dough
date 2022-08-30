import {
  Assert,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsTuple,
  IsType,
  Optional,
} from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import Object from "Src/utils/Object";
import { ColourNames, CT, GetColour, Size, Sizes } from "Src/Theme";
import { HasValue, IsOneOf } from "Src/utils/Type";
import Grid from "Src/styles/Grid";
import GridLocation from "Src/styles/GridLocation";

const IsAreaBreakpoint = IsObject({
  breakpoint: IsOneOf(...Sizes),
  dimensions: IsTuple(IsNumber, IsNumber, IsNumber, IsNumber),
});

const IsArea = IsObject({
  name: IsString,
  colour: Optional(IsOneOf(...ColourNames, "")),
  breakpoints: IsArray(IsAreaBreakpoint),
});

type Area = IsType<typeof IsArea>;

function ParseBreakpoint(
  [value, breakpoint]: readonly [string[], string],
  index: number
) {
  const result = {
    breakpoint,
    dimensions: value[index].split("x").map((p) => parseInt(p)),
  };

  Assert(IsAreaBreakpoint, result);

  return result;
}

const Props = {
  areas: IsString,
  colours: Optional(IsString),
  ...Object.MapArrayAsKeys(Sizes, () => Optional(IsString)),
};

export default class Layout extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected IsProps = Props;

  private get Model() {
    const props = this.Props;
    const areas = props.areas.split(",");
    const colours = props.colours?.split(",") ?? [];
    const parts = Object.Keys(props)
      .filter((k) => Sizes.find((s) => s === k))
      .map((k) => {
        const value = props[k];
        if (value) return [value, k] as const;
        return undefined;
      })
      .filter(HasValue)
      .map(([v, k]) => [v.split(","), k] as const);

    const result = [];
    if (colours.length && colours.length !== areas.length)
      throw new Error("If including colours, there must be one for each area");

    if (parts.some(([v]) => v.length !== areas.length))
      throw new Error(
        "Values must exist for each area in a layout for each size specified"
      );

    for (let i = 0; i < areas.length; i++) {
      result.push({
        name: areas[i],
        colour: colours[i] ?? undefined,
        breakpoints: parts.map((b) => ParseBreakpoint(b, i)),
      });
    }

    Assert(IsArray(IsArea), result);
    return result;
  }

  protected Render(props: FromProps<typeof Props>) {
    const model = this.Model;
    let css = Css.Init()
      .With(
        Rule.Init(":host").With(new Grid(12, "0", 12)).With("height", "100%")
      )
      .With(Rule.Init("div").With(CT.padding.block));
    for (const { name, colour, breakpoints } of model) {
      let rule = Rule.Init("." + name);
      if (colour) rule = rule.With(GetColour(colour));

      for (const {
        breakpoint,
        dimensions: [left, width, top, height],
      } of breakpoints)
        rule = rule.With(
          new GridLocation([left, width], [top, height]).WithMedia(
            "min-width",
            CT.screen[breakpoint].breakpoint
          )
        );

      css = css.With(rule);
    }

    return WithStyles(
      <>
        {model.map((a) => (
          <div key={a} class={a.name}>
            <slot name={a.name} />
          </div>
        ))}
      </>,
      css
    );
  }
}
