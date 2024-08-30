defmodule GoldcrestHttpServerTest do
  use ExUnit.Case
  doctest GoldcrestHttpServer

  test "greets the world" do
    assert GoldcrestHttpServer.hello() == :world
  end
end
