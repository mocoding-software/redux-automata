import * as Redux from "redux";

export interface TaskState<TResult = void, TError extends Error = Error> {
  isProcessing: boolean;
  error?: TError | null;
  result?: TResult | null;
}

export type Task<TResult, TInput = void> = (input: TInput) => Promise<TResult>;
export type TaskComplete<TResults, TInput = undefined> = (
  dispatch: Redux.Dispatch,
  result: TResults,
  input: TInput,
) => void;
