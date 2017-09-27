export interface TaskState<TResult = undefined, TError extends TaskError = TaskError> {
    isProcessing: boolean;
    error?: TError;
    result?: TResult;
}

export interface ParameterizedTaskState<TInput, TResult, TError extends TaskError = TaskError>
    extends TaskState<TResult, TError> {

    input?: TInput;
}

export interface TaskError {
    status?: number;
    message?: string;
}