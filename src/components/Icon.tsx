import { IsString } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";

Define(
  "p-icon",
  {
    area: IsString,
    variant: IsString,
    width: IsString,
    height: IsString,
    colour: IsOneOf(...ColourNames),
  },
  {},
  {
    render() {
      this.listen("render", function () {
        const target = this.root.querySelector("svg");
        if (!target) return;
        const input = document.createElement("div");
        input.innerHTML = require(`remixicon/icons/${this.props.area}/${this.props.variant}-line.svg`);

        target.innerHTML = input.querySelector("g")?.innerHTML ?? "";
        this.root.replaceChildren(...this.root.childNodes);
      });
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewbox="0 0 24 24"
        />
      );
    },
    css() {
      return {
        ":host": {
          width: this.props.width,
          height: this.props.height,
        },
        svg: {
          width: this.props.width,
          height: this.props.height,
          fill: GetColour(this.props.colour)?.Hex,
        },
      };
    },
  }
);
