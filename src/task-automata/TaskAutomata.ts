import * as Redux from "redux";
import { ActionDefinition, Automata, PayloadAction, StateDefinition } from "../core";
import { Task, TaskComplete, TaskState } from "./common";

export class TaskAutomata<
    TResult,
    TInput = undefined,
    TError extends Error = Error,
    TState extends TaskState<TResult, TError> = TaskState<TResult, TError>> extends Automata<TState> {

    // states
    public Idle: StateDefinition<TState>;
    public Processing: StateDefinition<TState, TInput>;
    public Completed: StateDefinition<TState, TResult>;
    public Failure: StateDefinition<TState, TError>;

    // actions
    public Start: ActionDefinition<TInput>;
    public Cancel: ActionDefinition;
    public End: ActionDefinition<TResult>;
    public Fail: ActionDefinition<TError>;

    /**
     *
     */
    constructor(
        readonly Name: string,
        private Process: Task<TResult, TInput>,
        private OnSuccess?: TaskComplete<TResult, TInput>,
        private OnFailure?: TaskComplete<TError, TInput>) {

        super(Name + " Automata");

        this.Idle = this.state("Idle", () => this.getDefaultState());

        this.Processing = this.state("Processing",
            () => this.mergeState({
                error: null,
                isProcessing: true,
            } as TState));

        this.Completed = this.state<TResult>("Completed",
            (state, result) => this.mergeState({
                error: null,
                isProcessing: false,
                result,
            } as TState));

        this.Failure = this.state<TError>("Failure",
            (state, error) => this.mergeState({
                error,
                isProcessing: false,
            } as TState));

        this.Start = this.action<TInput>(this.Name + " Start");
        this.Cancel = this.action(this.Name + " Cancel");
        this.End = this.action<TResult>(this.Name + " Success");
        this.Fail = this.action<TError>(this.Name + " Fail");
    }

    public setupProcessIn(state: StateDefinition<TState>) {

        const {
            Idle,
            Processing,
            Completed,
            Failure,

            Start,
            End,
            Fail,
            Cancel,

            BeginProcessing,
        } = this;

        this.in(state)
            .or(Failure)
                .on(Start)
                    .execute(BeginProcessing)
                    .goTo(Processing)
            .in(Processing)
                .on(End)
                    .goTo(Completed)
                .on(Fail)
                    .goTo(Failure)
            .in(Failure)
                .on(Cancel)
                    .goTo(Idle);
    }

    // transitions
    protected BeginProcessing = (dispatch: Redux.Dispatch<any>, input: TInput) =>
        this.Process(input)
            .then(_ => {
                const result = dispatch(this.End(_));
                if (this.OnSuccess)
                    this.OnSuccess(dispatch, _, input);
                return result;
            })
            .catch(_ => {
                const result = dispatch(this.Fail(_));
                if (this.OnFailure)
                    this.OnFailure(dispatch, _, input);
                return result;
            })

    protected getDefaultState(): TState {
        return ({ isProcessing: false }) as TState;
    }
}
