defmodule ExperimentServer do
  def start(port) do
    listener_options = [active: false, packet: :http_bin]

    {:ok, listen_socket} =
      :gen_tcp.listen(
        port,
        listener_options
      )

    IO.puts("Listening on port #{port}")
    {:ok, connection_sock} = :gen_tcp.accept(listen_socket)
    {:ok, messages} = recv(connection_sock)
    :ok = :gen_tcp.close(connection_sock)
    :ok = :gen_tcp.close(listen_socket)

    IO.puts("""
    Messages:
    #{inspect(messages)}
    """)

    :ok
  end

  defp recv(connection_sock, messages \\ []) do
    case :gen_tcp.recv(connection_sock, 0) do
      {:ok, message} ->
        IO.puts("""
        Got message: #{inspect(message)}
        """)

        recv(connection_sock, [message | messages])

      {:error, :closed} ->
        IO.puts("Socket closed")
        {:ok, messages}
    end
  end
end

ExperimentServer.start(4040)
