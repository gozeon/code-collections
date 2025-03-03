defmodule CowboyExample.Router.Handlers.Static do
  require Logger

  def init(req0, state) do
    Logger.info("Received request: #{inspect(req0)}")
    page = :cowboy_req.binding(:page, req0)

    req1 =
      case html_for(page) do
        {:ok, static_html} ->
          :cowboy_req.reply(
            200,
            %{"content-type" => "text/html"},
            static_html,
            req0
          )

        _ ->
          :cowboy_req.reply(
            404,
            %{"content-type" => "text/html"},
            "404 Not found",
            req0
          )
      end

    {:ok, req1, state}
  end

  defp html_for(page) do
    priv_dir =
      :cowboy_example
      |> :code.priv_dir()
      |> to_string()

    IO.puts(priv_dir)
    page_path = priv_dir <> "/static/#{page}"
    File.read(page_path)
  end
end
