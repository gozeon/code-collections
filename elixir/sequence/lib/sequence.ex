defmodule Sequence do
  @server Sequence.Server
  def start_link(curent_number) do
    GenServer.start_link(@server, curent_number, name: @server)
  end

  def next_number do
    GenServer.call(@server, :next_number)
  end

  def set_number(new_number) do
    GenServer.call(@server, {:set_number, new_number})
  end

  def incr_number(delta) do
    GenServer.cast(@server, {:incr_number, delta})
  end
end
