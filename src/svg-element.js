class SVGElement {

    constructor(
        tag,
    ) {
        this.tag = tag;

        this.attributes = null;

        this.children = [];

        this.innerText = null;

        this.style = null;
    }

    static create(tag) {
        const element = new SVGElement(tag);

        if (tag === 'svg') {
            element.attr('xmlns', 'http://www.w3.org/2000/svg');
        }

        return element;
    }

    append(tag) {
        const element = SVGElement.create(tag);

        this.children.push(element);

        return element;
    }

    attr(name, value) {
        if (!this.attributes) {
            this.attributes = {};
        }

        this.attributes[name] = value;

        return this;
    }

    style(name, value) {
        if (!this.styles) {
            this.styles = {};
        }

        this.styles[name] = value;

        return this;
    }

    text(value) {
        this.innerText = value;

        return this;
    }

    toString() {
        return `<${this.tag}${this.attributesToString()}${this.stylesToString()}>${this.innerTextToString()}${this.childrenToString()}</${this.tag}>`;
    }

    attributesToString() {
        return this.attributes? ` ${Object.keys(this.attributes).map((key) => `${key}="${this.attributes[key]}"`).join(' ')}` : '';
    }

    childrenToString() {
        return this.children.map((element) => element.toString()).join('');
    }

    innerTextToString() {
        return this.innerText ? this.innerText : '';
    }

    stylesToString() {
        return this.styles? ` style="${Object.keys(this.styles).map((key) => `${key}: ${this.styles[key]}`).join(';')}"` : '';
    }
}

module.exports = {
    SVGElement,
};
