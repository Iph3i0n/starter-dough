import Object from "./Object";

type Query = Readonly<Record<string, string[]>>;

export default class Router {
  private static RenderQueryString(query: Query) {
    const result: string[] = [];

    for (const key in query)
      if (!query.hasOwnProperty(key)) continue;
      else
        result.push(
          ...query[key].map(
            (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
          )
        );

    if (result.length) return "?" + result.join("&");

    return "";
  }

  public static get Pathname() {
    return window.location.pathname.split("/").filter((p) => p);
  }

  public static get Query() {
    const parsed = new URLSearchParams(window.location.search);
    let result: Query = {};
    for (const [key, value] of parsed) {
      if (result[key])
        result = Object.Assign(result, {
          get [key]() {
            return [...result[key], value];
          },
        });
      else
        result = Object.Assign(result, {
          get [key]() {
            return [value];
          },
        });
    }

    return result;
  }

  public static get Origin() {
    return window.location.origin;
  }

  public static get Hash() {
    return window.location.hash;
  }

  private static Render(pathnames: string[], query: Query, hash: string) {
    let result = "/" + pathnames.join("/") + this.RenderQueryString(query);

    if (hash) result += "#" + hash;

    window.history.pushState(undefined, "", result);
    window.dispatchEvent(new Event("pushstate"));
  }

  public static PushUrl(url: string) {
    this.Render(url.split("/"), this.Query, this.Hash);
  }

  public static PushQuery(query: Query, mode: "replace" | "join") {
    this.Render(
      this.Pathname,
      mode === "replace" ? query : { ...this.Query, ...query },
      this.Hash
    );
  }

  public static DeleteQuery(key: string) {
    const query = { ...this.Query, [key]: [] };
    this.Render(this.Pathname, query, this.Hash);
  }

  public static PushHash(hash: string) {
    window.location.hash = hash;
  }

  public static At(target: string) {
    return target.toLowerCase() === window.location.pathname.toLowerCase();
  }
}
