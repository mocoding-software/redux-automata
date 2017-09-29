import * as Redux from "redux";
import { ActionDefinition } from "../core";

export interface TaskState<TResult = undefined, TError extends Error = Error> {
    isProcessing: boolean;
    error?: TError | null;
    result?: TResult | null;
}

export type Task<TResult, TInput = undefined> = (input: TInput) => Promise<TResult>;
export type TaskComplete<TResults, TInput = undefined> =
    (dispatch: Redux.Dispatch<any>, result: TResults, input: TInput) => void;