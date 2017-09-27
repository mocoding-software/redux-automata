import * as Redux from "redux";
import { ActionDefinition, Automata, StateDefinition } from "../core";
import { TaskError, TaskState } from "./common";

export interface ProcessCompleteDelegate<TOutput> {
    (dispatch: Redux.Dispatch<any>, output: TOutput): void;
}

export class TaskAutomata<TState extends TaskState<TResult, TError>, TResult, TError extends TaskError = TaskError>
    extends Automata<TState> {

    // states
    public Idle: StateDefinition<TState>;
    public Processing: StateDefinition<TState>;
    public Completed: StateDefinition<TState, TResult>;
    public Failure: StateDefinition<TState, TError>;

    // actions
    public Start: ActionDefinition;
    public Cancel: ActionDefinition;
    public End: ActionDefinition<TResult>;
    public Fail: ActionDefinition<TError>;

    // // transitions
    // protected MakeApiRequest = (dispatch: Redux.Dispatch<any>) =>
    //     this.ApiCall()
    //         .then(_ => {
    //             var result = dispatch(this.RequestSucceeded(_));
    //             if (this.OnSuccess)
    //                 this.OnSuccess(dispatch, _);
    //             return result;
    //         })
    //         .catch(_ => {
    //             var result = dispatch(this.RequestFailed(_));
    //             if (this.OnFailure)
    //                 this.OnFailure(dispatch, _);
    //             return result;
    //         });

    /**
     *
     */
    constructor(readonly Name: string,
        protected Process: () => Promise<TResult>,
        private OnSuccess?: ProcessCompleteDelegate<TResult>,
        private OnFailure?: ProcessCompleteDelegate<TError>) {

        super(Name + " Automata");

        this.Idle = this.state("Idle", () => this.getDefaultState());

        this.Processing = this.state("Processing",
            () => this.mergeState({
                isProcessing: true,
                error: null,
            } as TState));

        this.Completed = this.state<TResult>("Completed",
            (state, data) => this.mergeState({
                isBusy: false,
                data: data || this.current.data,
                error: null
            } as TState));

        this.Failure = this.state<IGenericDataError>("Failure",
            (state, error) => this.mergeState({
                isBusy: false,
                error
            } as TState));

        this.ApiRequest = this.Action(this.Name + " API Request");
        this.Refresh = this.Action(this.Name + " Refresh");
        this.Cancel = this.Action(this.Name + " Cancel");
        this.RequestSucceeded = this.Action<TData>(this.Name + " Request Succeeded");
        this.RequestFailed = this.Action<IGenericDataError>(this.Name + "Request Failed");
    }

    protected getDefaultState(): TState {
        return ({ isProcessing: false }) as TState;
    }

    SetupApiCallIn(state: StateFunction<TState, {}>) {

        const {
            //states
            Idle,
            Working,
            Completed,
            Failure,

            ApiRequest,
            RequestSucceeded,
            RequestFailed,
            Cancel,

            //transitions
            MakeApiRequest,
        } = this;

        this.In(state)
            .On(ApiRequest)
            .Execute(MakeApiRequest)
            .GoTo(Working)
            .In(Working)
            .On(RequestSucceeded)
            .GoTo(Completed)
            .On(RequestFailed)
            .GoTo(Failure)

            .In(Failure)
            .On(ApiRequest)
            .Execute(MakeApiRequest)
            .GoTo(Working)
            .On(Cancel)
            .GoTo(Idle)
    }

    EnableRefreshIn(state: StateFunction<TState, {}>) {
        const {
            //states            
            Completed,
            Working,

            Refresh,

            //transitions
            MakeApiRequest,
        } = this;

        this.In(state)
            .On(Refresh)
            .Execute(MakeApiRequest)
            .GoTo(Working)
    }
}