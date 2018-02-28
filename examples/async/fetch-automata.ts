import * as Redux from "redux";
import { Automata } from "redux-automata";

export interface ResponseState {
    isFetching?: boolean;
    error?: string;
    data?: GithubResposne;
}

export interface GithubResposne {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    watchers: number;
    subscribers_count: number;
}

const automata = new Automata<ResponseState>("FetchAutomata");

// states
const Idle = automata.state("Idle", () => ({}));
const Fetching = automata.state("Fetching", () => ({ isFetching: true }));
const Fetched = automata.state<GithubResposne>("Fetched", (state, data) => ({ data }));
const FetchingFailed = automata.state<string>("Failed", (state, error) => ({ error }));

// actions
const Fetch = automata.action("Fetch");
const Refresh = automata.action("Refresh");
const RequestSucceeded = automata.action<GithubResposne>("Request Succeeded");
const RequestFailed = automata.action<string>("Request Failed");

// transitions
const FetchData = (dispatch: Redux.Dispatch<any>) =>
    fetch("https://api.github.com/repos/mocoding-software/redux-automata")
        .then(response => {
            response.text().then(text => {
                const data = JSON.parse(text);
                if (response.status === 200) {
                    // dispatch(RequestSucceeded(data));
                    // small delay to see a loader
                    setTimeout(() => dispatch(RequestSucceeded(data)), 1000);
                } else
                    dispatch(RequestFailed(
                        "Failed to get data from GitHub. Status Code: "
                        + response.status + ". Message: " + data.message));
            });
        })
        .catch(_ => dispatch(RequestFailed(JSON.stringify(_))));

automata
    .in(Idle)
    .or(FetchingFailed)
        .on(Fetch)
            .execute(FetchData)
            .goTo(Fetching)
    .in(Fetching)
        .on(RequestSucceeded)
            .goTo(Fetched)
        .on(RequestFailed)
            .goTo(FetchingFailed)
    .in(FetchingFailed)
    .or(Fetched)
        .on(Refresh)
            .execute(FetchData)
            .goTo(Fetching);

automata.beginWith(Idle);

export {
    automata as fetchAutomata,
    Fetch,
    Refresh
};
