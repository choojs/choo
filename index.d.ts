import Nanobus = require('nanobus')

export = Choo

declare class Choo {
  constructor (opts?: Choo.IChoo)
  use (callback: (state: Choo.IState, emitter: Nanobus, app: this) => void): void
  route (routeName: string, handler: (state: Choo.IState, emit: Nanobus['emit']) => void): void
  mount (selector: string): void
  start (): HTMLElement
  toString (location: string, state?: Choo.IState): string
}

declare namespace Choo {
  export interface IChoo {
    history?: boolean
    href?: boolean
    hash?: boolean
    cache?: number | ICache
  }

  export interface ICache {
    get(id: string | number): undefined | null | any
    set(id: string | number, element: any): void
  }

  export interface IState {
    events: {
      [key: string]: string
    }
    params: {
      [key: string]: string
    }
    query?: {
      [key: string]: string
    }
    href: string
    route: string
    title: string
    [key: string]: any
  }
}

