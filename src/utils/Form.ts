import "element-internals-polyfill";
import "form-request-submit-polyfill";
import PreactComponent, { IsProps } from "Src/BuildComponent";

export default abstract class FormComponent<
  TProps extends IsProps = {}
> extends PreactComponent<TProps, Record<string, string | boolean>> {
  public static formAssociated = true;
  private readonly internals: ElementInternals;
  private readonly on_change = () => (this.State = this.FormValues);

  public constructor() {
    super();
    this.internals = this.attachInternals();

    this.State = this.FormValues;
    this.internals.form?.addEventListener("change", this.on_change);
  }

  public get FormValues() {
    const form = this.internals.form;
    if (!form) return {};

    const data = new FormData(form);
    const result: Record<string, string | boolean> = {};
    for (const [key, value] of data.entries()) {
      const v = value.toString();
      result[key] = v === "" || v === "true" ? true : v === "false" ? false : v;
    }

    return result;
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.internals.form?.removeEventListener("change", this.on_change);
  }

  public get value() {
    return this.State[this.Props.name];
  }

  public set value(v: string | boolean) {
    this.internals.setFormValue(v.toString());
  }

  public get name() {
    return this.getAttribute("name");
  }

  protected Submit() {
    this.internals.form?.requestSubmit();
  }
}
