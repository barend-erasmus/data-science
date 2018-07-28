export class SVGElement {
  protected attributes: {} = null;

  protected children: SVGElement[] = [];

  protected innerText: string = null;

  protected styles: {} = null;

  constructor(protected tag: string) {}

  public static create(tag: string): SVGElement {
    const element: SVGElement = new SVGElement(tag);

    if (tag === 'svg') {
      element.attr('xmlns', 'http://www.w3.org/2000/svg');
    }

    return element;
  }

  public append(tag: string): SVGElement {
    const element: SVGElement = SVGElement.create(tag);

    this.children.push(element);

    return element;
  }

  public attr(name: string, value: string | number): SVGElement {
    if (!this.attributes) {
      this.attributes = {};
    }

    this.attributes[name] = value;

    return this;
  }

  public style(name: string, value: string | number): SVGElement {
    if (!this.styles) {
      this.styles = {};
    }

    this.styles[name] = value;

    return this;
  }

  public text(value: string): SVGElement {
    this.innerText = value;

    return this;
  }

  public toString(): string {
    return `<${
      this.tag
    }${this.attributesToString()}${this.stylesToString()}>${this.innerTextToString()}${this.childrenToString()}</${
      this.tag
    }>`;
  }

  private attributesToString(): string {
    return this.attributes
      ? ` ${Object.keys(this.attributes)
          .map((key) => `${key}="${this.attributes[key]}"`)
          .join(' ')}`
      : '';
  }

  private childrenToString(): string {
    return this.children.map((element) => element.toString()).join('');
  }

  private innerTextToString(): string {
    return this.innerText ? this.innerText : '';
  }

  private stylesToString(): string {
    return this.styles
      ? ` style="${Object.keys(this.styles)
          .map((key) => `${key}: ${this.styles[key]}`)
          .join(';')}"`
      : '';
  }
}
