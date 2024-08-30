defmodule TestGoldcrestHttpServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    port = Application.fetch_env!(:test_goldcrest_http_server, :port)

    children = [
      {Goldcrest.HTTPServer, [port]}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TestGoldcrestHttpServer.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
