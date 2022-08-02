import Register from "Src/Register";
import { h, Fragment } from "preact";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import { FormContext } from "./Form";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Colour from "Src/styles/Colour";
import { useContext } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Absolute from "Src/styles/Absolute";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-button": CustomElement<{ colour: ColourName; outline?: true }>;
      "p-button-group": CustomElement<{}>;
    }
  }
}

Register(
  "p-button",
  {
    colour: IsOneOf(...ColourNames),
    outline: Optional(IsLiteral(true)),
    href: Optional(IsString),
    type: Optional(IsString),
  },
  (props) => {
    const css = Css.Init()
      .With(
        Rule.Init(":host")
          .With(CT.text.body.WithPadding(CT.padding.input))
          .With("display", "inline-block")
          .With(
            props.outline
              ? CT.border.standard.WithColour(GetColour(props.colour))
              : CT.border.standard
          )
          .With("margin", "0")
          .With("cursor", "pointer")
          .With("user-select", "none")
          .With("position", "relative")
          .With(
            new Transition("fast", "background-color", "color", "border-color")
          )
          .With(
            props.outline
              ? new Colour([0, 0, 0, 0], GetColour(props.colour))
              : GetColour(props.colour)
          )
          .With(CT.box_shadow.large)
          .With("box-sizing", "border-box")
          .With(
            "modifier",
            Rule.Init("(:hover)").With(
              GetColour(props.colour).GreyscaleTransform(120, true)
            )
          )
      )
      .With(
        Rule.Init(".button")
          .With("opacity", "0")
          .With(
            new Absolute({
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            })
          )
          .With("cursor", "pointer")
      );

    if (props.href)
      return WithStyles(
        <>
          {props.children}
          <a href={props.href} class="button" />
        </>,
        css
      );

    if (props.type === "submit") {
      const { submit } = useContext(FormContext);
      return WithStyles(
        <>
          <button type="submit" class="button" onClick={(e: any) => submit()} />
          {props.children}
        </>,
        css
      );
    }

    return WithStyles(
      <>
        <button type={props.type ?? ""} class="button" />
        {props.children}
      </>,
      css
    );
  }
);

Register("p-button-group", {}, (props) => {
  return WithStyles(
    <>{props.children}</>,
    Css.Init()
      .With(Rule.Init(":host").With("font-size", "0"))
      .With(Rule.Init("p-button").With("border-radius", "0"))
      .With(
        Rule.Init("p-button:first-child")
          .With("border-top-left-radius", CT.border.standard.Radius)
          .With("border-bottom-left-radius", CT.border.standard.Radius)
      )
      .With(
        Rule.Init("p-button:last-child")
          .With("border-top-right-radius", CT.border.standard.Radius)
          .With("border-bottom-right-radius", CT.border.standard.Radius)
      )
  );
});
