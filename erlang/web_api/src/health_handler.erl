-module(health_handler).
-behaviour(cowboy_handler).
-export([init/2]).

-import(helper, [reply/3]).
init(Req, State) ->
    Map2 = #{msg => <<"ok">>, env => application:get_all_env(web_api)},
    {ok, reply(200, Map2, Req), State}.
