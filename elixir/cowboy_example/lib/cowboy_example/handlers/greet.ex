defmodule CowboyExample.Router.Handlers.Greet do
  require Logger

  def init(%{method: "GET"} = req0, state) do
    Logger.info("Received request: #{inspect(req0)}")
    who = :cowboy_req.binding(:who, req0)

    greeting = req0 |> :cowboy_req.parse_qs() |> Enum.into(%{}) |> Map.get("greeting", "a")

    IO.inspect(:cowboy_req.parse_qs(req0))

    req1 =
      :cowboy_req.reply(
        200,
        %{"content-type" => "text/html;charset=UTF-8"},
        "Hello 你好 #{greeting} #{who}",
        req0
      )

    {:ok, req1, state}
  end

  def init(req0, state) do
    Logger.info("Received request: #{inspect(req0)}")

    req1 =
      :cowboy_req.reply(
        404,
        %{"content-type" => "text/html"},
        "404 Not found",
        req0
      )

    {:ok, req1, state}
  end
end
