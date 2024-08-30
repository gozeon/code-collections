defmodule ExperimentServer do
  require Logger

  def start(port) do
    listener_options = [active: false, packet: :http_bin, reuseaddr: true]

    {:ok, listen_socket} = :gen_tcp.listen(port, listener_options)

    Logger.info("Listening on port #{port}")

    listen(listen_socket)
    :gen_tcp.close(listen_socket)
  end

  defp listen(listen_socket) do
    {:ok, connection_sock} = :gen_tcp.accept(listen_socket)
    {:ok, req} = :gen_tcp.recv(connection_sock, 0)
    Logger.info("Got request: #{inspect(req)}")
    respond(connection_sock)
    listen(listen_socket)
  end

  defp http_1_1_response(body, status) do
    """
    HTTP/1.1 #{status}\r
    Content-Type: text/html\r
    Content-Length: #{byte_size(body)}\r
    \r

    #{body}
    """
  end

  defp respond(connection_sock) do
    response = http_1_1_response("Hello World", 200)
    :gen_tcp.send(connection_sock, response)
    Logger.info("Sent response")
    :gen_tcp.close(connection_sock)
  end
end

ExperimentServer.start(4040)
