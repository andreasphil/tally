import type { JSX as VueJSX } from "vue-jsx";

declare global {
  namespace JSX {
    type Element = VueJSX.Element;
    type ElementChildrenAttribute = VueJSX.ElementChildrenAttribute;
    type IntrinsicElements = VueJSX.IntrinsicElements;
    type IntrinsicAttributes = VueJSX.IntrinsicAttributes;
    type LibraryManagedAttributes<Component, Props> = VueJSX.LibraryManagedAttributes<
      Component,
      Props
    >;
  }
}
