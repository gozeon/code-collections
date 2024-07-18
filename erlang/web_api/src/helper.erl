-module(helper).

-export([get_body/2]).
-export([reply/2]).
-export([reply/3]).
-export([pwd2md5/1]).

get_body(Body, Req) ->
    case Body of
        [{Input, true}] ->
            {ok, Input, Req};
        [] ->
            {error, empty, reply(<<"Missing body">>, Req)};
        _ ->
            {error, empty, reply(<<"Bad request">>, Req)}
    end.


reply(Body, Req0) ->
    Req1 = cowboy_req:set_resp_headers(#{<<"content-type">> => <<"application/json">>}, Req0),
    cowboy_req:set_resp_body(thoas:encode(Body), Req1).
reply(Status, Body, Req0) ->
    cowboy_req:reply(Status, #{<<"content-type">> => <<"application/json">>}, thoas:encode(Body), Req0).


get_md5_hex_str(Str) ->
    X = erlang:md5(Str),
    [begin if N < 10 -> 48 + N; true -> 87 + N end end || <<N:4>> <= X].

pwd2md5(Bin) ->
    Hex = list_to_binary(application:get_env(web_api, hex, "hex")),
    get_md5_hex_str(<<Bin/binary, Hex/binary, Bin/binary, Hex/binary>>).
