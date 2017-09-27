
interface Data {
    message: string;
}

const promise = new Promise<Data>((ok, cancel) => setTimeout(() => ok({ message: "data" })));

const automation = promiseAutomata("Some", promise, dispatch => dispatch(push("/debug")));