%%%-------------------------------------------------------------------
%% @doc web_api public API
%% @end
%%%-------------------------------------------------------------------

-module(web_api_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    Dispatch = cowboy_router:compile([         
            {'_', [
                {"/", hello_handler, []},
                {"/health", health_handler, []},
                {"/login", login_handler, []}
            ]}     
    ]),     
    {ok, _} = cowboy:start_clear(web_api,
        [{port, application:get_env(web_api, port, 8080)}],
        #{env => #{dispatch => Dispatch}
    }),
    web_api_sup:start_link().

stop(_State) ->
    ok.

%% internal functions
