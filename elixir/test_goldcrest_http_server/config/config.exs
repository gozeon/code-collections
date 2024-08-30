import Config

config :test_goldcrest_http_server,
  port: 4001

config :goldcrest_http_server,
  responder: TestGoldcrestHTTPServer.Responder
