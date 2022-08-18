import "element-internals-polyfill";
import "form-request-submit-polyfill";
import PreactComponent, { IsProps } from "Src/BuildComponent";

export default abstract class FormComponent<
  TProps extends IsProps = {}
> extends PreactComponent<
  TProps,
  Record<string, string | boolean | undefined>
> {
  public static formAssociated = true;
  private readonly internals: ElementInternals;
  private readonly on_change = () => (this.State = this.FormValues);

  private get form(): HTMLFormElement {
    const form = this.internals.form;
    if (!form) throw new Error("Form elements must be inside a form");

    return form;
  }

  public constructor() {
    super();
    this.internals = this.attachInternals();
  }

  public get FormValues() {
    const data = new FormData(this.form);
    const result: Record<string, string | boolean> = {};
    for (const [key, value] of data.entries()) {
      const v = value.toString();
      result[key] = v === "" || v === "true" ? true : v === "false" ? false : v;
    }

    return result;
  }

  public connectedCallback() {
    this.State = this.FormValues;
    if (!this.form.FormValue) this.form.FormValue = {};
    this.form.removeEventListener("change", this.on_change);

    super.connectedCallback();
  }

  public get value() {
    return this.State[this.Props.name] ?? undefined;
  }

  public set value(v: string | boolean | undefined) {
    this.State = { ...this.State, [this.Props.name]: v };
    this.internals.setFormValue(v?.toString() ?? null);

    this.form.removeEventListener("change", this.on_change);
    this.form.dispatchEvent(new Event("change"));
    this.form.addEventListener("change", this.on_change);
  }

  public get name() {
    return this.getAttribute("name");
  }

  protected Submit() {
    this.internals.form?.requestSubmit();
  }

  public formDisabledCallback(disabled: boolean) {
    this.setAttribute("disabled", disabled.toString());
  }

  public formResetCallback() {
    this.value = this.getAttribute("default") ?? "";
  }
}
