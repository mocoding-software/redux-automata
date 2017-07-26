import * as Redux from 'redux';
export declare function automataMiddleware<S>(api: Redux.MiddlewareAPI<S>): (next: Redux.Dispatch<S>) => Redux.Dispatch<S>;
