import Css, { Rule } from "Src/CSS";
import { useEffect, useRef, useState } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import { FromProps, IsProps } from "Src/BuildComponent";
import tinymce, { Editor } from "tinymce";

import "tinymce/icons/default";
import "tinymce/models/dom";

import "tinymce/themes/silver";

// @ts-ignore: Importing CSS file content
import MainCss from "tinymce/skins/ui/oxide/skin.css";

import "tinymce/plugins/advlist";
import "tinymce/plugins/code";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";

// @ts-ignore: Importing CSS file content
import ContentUiCss from "tinymce/skins/ui/oxide/content.css";
// @ts-ignore: Importing CSS file content
import ContentCss from "tinymce/skins/content/default/content.css";
import { CT } from "Src/Theme";
import Colour from "Src/styles/Colour";
import FormComponent from "Src/utils/Form";
import Object from "Src/utils/Object";

const Props = {
  name: IsString,
  default: Optional(IsString),
};

export default class RichText extends FormComponent<typeof Props> {
  protected IsProps = Props;

  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected Render(props: FromProps<typeof Props>) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [editor, set_editor] = useState<Editor>();

    useEffect(() => {
      const target = ref.current;
      if (!target) return;

      tinymce
        .init({
          target: target,
          skin: false,
          content_css: false,
          setup: (ed) => {
            ed.on("init", () => {
              ed.setContent(props.default ?? "");
              this.value = props.default ?? "";
            });

            ed.on("change", () => {
              this.value = ed.getContent();
            });
          },
        })
        .then(([e]) => set_editor(e));
    }, [ref.current]);

    useEffect(() => {
      editor?.setContent(props.default ?? "");
      this.value = props.default ?? "";
    }, [props.default]);

    return WithStyles(
      <textarea name={props.name} ref={ref} />,
      Css.Init()
        .With(MainCss)
        .With(ContentUiCss)
        .With(ContentCss)
        .With(Rule.Init("textarea").With("display", "block"))
        .With(Rule.Init(".tox .tox-menubar").With(CT.colours.surface))
        .With(Rule.Init(".tox .tox-mbtn").With(CT.colours.surface))
        .With(
          Rule.Init(
            ".tox .tox-toolbar, .tox .tox-toolbar__primary, .tox .tox-toolbar__overflow"
          ).With(CT.colours.surface)
        )
        .With(Rule.Init(".tox-tinymce").With(CT.border.standard))
        .With(
          Rule.Init(".tox .tox-tbtn svg").With(
            "fill",
            new Colour(CT.colours.surface.Text).Hex
          )
        )
        .With(
          Rule.Init(".tox:not(.tox-tinymce-inline) .tox-editor-header").With(
            CT.colours.surface
          )
        )
        .With(Rule.Init(".tox .tox-statusbar").With("display", "none"))
    );
  }
}
