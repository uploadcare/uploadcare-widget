/* @flow */

declare module 'hyperapp' {
  declare export interface VNode<Attributes = any> {
    nodeName: string;
    attributes: Attributes;
    children: Array<Children>;
    key: string;
  }

  declare export interface Component<Attributes = any, State = any, Actions = any> {
    (attributes: Attributes, children: Array<Children>): VNode<> | VNode<Attributes> | View<State, Actions>;
  }

  declare export interface View<State, Actions> {
    (state: State, actions: Actions): VNode<>;
  }

  declare export type Children = VNode<> | string | number | null | void

  declare export function h<Attributes>(
    nodeName: Component<Attributes, any, any> | string,
    attributes: Attributes,
    ...children: Array<Children | Array<Children>>
  ): VNode<Attributes>

  declare export function app<State, Actions>(
    state: State,
    actions: Actions,
    view: View<State, Actions>,
    container: Element | null
  ): Actions
}
