defmodule HelloWeb.ProductHTML do
  use HelloWeb, :html

  embed_templates "product_html/*"

  @doc """
  Renders a product form.
  """
  attr :changeset, Ecto.Changeset, required: true
  attr :action, :string, required: true

  def product_form(assigns)

  def category_opts(changeset) do
    existing_ids =
      changeset
      |> Ecto.Changeset.get_change(:categories, [])
      |> Enum.map(& &1.data.id)

    for cat <- Hello.Catalog.list_categories(),
        do: [key: cat.title <> "  ##{cat.id}", value: cat.id, selected: cat.id in existing_ids]
  end
end
