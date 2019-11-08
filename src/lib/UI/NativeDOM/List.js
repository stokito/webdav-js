import Element from './Element.js';
import Item from './List/Item.js';

export default class List extends Element {
  #collection;
  #items;

  constructor() {
    const template = '<ul class="loading"></ul>';

    super(template);

    this.bindEvents();
  }

  bindEvents() {
    this.on('list:update:request', () => this.loading());
    this.on('list:update:success', (collection) => this.update(collection));
    this.on('list:update:failed', () => this.loading(false));

    this.on('collection:update', (collection) => {
      if (collection === this.#collection) {
        this.update();
      }
    });

    this.on('entry:update', (entry) => {
      if (entry.collection === this.#collection) {
        this.update();
      }
    });

    const arrowHandler = (event) => {
      if (! ['ArrowUp', 'ArrowDown'].includes(event.key)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const current = this.element.querySelector('li:focus, li:focus-within'),
        next = current ? current.nextSibling : this.element.querySelector('li:first-child'),
        previous = current ? current.previousSibling : null
      ;

      if (event.key === 'ArrowUp' && previous) {
        previous.focus();
      }
      else if (event.key === 'ArrowDown' && next) {
        next.focus();
      }
    };

    document.addEventListener('keydown', arrowHandler);
    this.element.addEventListener('keydown', arrowHandler);
  }

  loading(loading = true) {
    if (loading) {
      return this.element.classList.add('loading');
    }

    this.element.classList.remove('loading');
  }

  update(collection = this.#collection) {
    this.emptyNode();

    this.#items = collection.map((entry) => new Item(entry));

    this.element.append(...this.#items.map((item) => item.element));

    this.loading(false);

    this.#collection = collection;
  }
}
