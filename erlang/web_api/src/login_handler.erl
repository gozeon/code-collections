-module(login_handler).
-behaviour(cowboy_rest).

%% REST Callbacks
-export([init/2]).
-export([allowed_methods/2]).
-export([content_types_accepted/2]).

-export([from_json/2]).


-import(helper, [get_body/2, reply/2, pwd2md5/1]).

init(Req, State) ->
    {cowboy_rest, Req, State}.

allowed_methods(Req, State) ->
    {[<<"POST">>], Req, State}.

content_types_accepted(Req, State) ->
    {[
        {<<"application/json">>, from_json}
    ], Req, State}.

from_json(Req, State) -> 
    {ok, KeyValues, Req0} = cowboy_req:read_urlencoded_body(Req),
    case get_body(KeyValues, Req0) of
        {ok, Input, _Req} ->
            {ok, D} = thoas:decode(Input),
            % 校验
            % E = maps:get(<<"email">>, D),
            P = maps:get(<<"password">>, D),
            D1 = D#{newa => list_to_atom(pwd2md5(P))},
            {true, reply(D1, Req0), State};
        {error, empty, Req2} ->
            {false, Req2, State}
    end.