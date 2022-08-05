import Css, { Rule } from "Src/CSS";
import Object from "Src/utils/Object";
import { useRef, useState } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import FormContext from "Src/contexts/Form";
import { GetComponent } from "Src/utils/Html";
import BuildComponent from "Src/BuildComponent";

class FormSubmitEvent<T> extends Event {
  public readonly Value: Readonly<T>;

  public constructor(value: T) {
    super("submit");
    this.Value = Object.AsReadonly(value);
  }
}

export default BuildComponent({}, function (props) {
  const [value, set_value] = useState({} as Record<string, string>);
  const ref = useRef<HTMLFormElement>(null);

  const submit = () =>
    GetComponent(this)?.dispatchEvent(new FormSubmitEvent(value));

  return WithStyles(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      ref={ref}
    >
      <FormContext.Provider
        value={{
          get: (key) => value[key] ?? "",
          set: (key, value) => set_value((v) => ({ ...v, [key]: value })),
          submit,
        }}
      >
        {props.children}
      </FormContext.Provider>
    </form>,
    Css.Init().With(
      Rule.Init(":host")
        .With("display", "block")
        .With("flex", "1")
        .With("width", "100%")
    )
  );
});
