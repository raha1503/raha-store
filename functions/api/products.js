export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const result = await env.DB.prepare(
      "SELECT * FROM products ORDER BY id DESC"
    ).all();

    return Response.json(result.results);
  }

  if (request.method === "POST") {
    const product = await request.json();

    const result = await env.DB.prepare(`
      INSERT INTO products
      (name, price, category, description, stock, sizes, colors, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.name,
      product.price,
      product.category,
      product.description || "",
      product.stock || 0,
      product.sizes || "",
      product.colors || "",
      product.images || ""
    ).run();

    return Response.json({
      success: true,
      id: result.meta.last_row_id
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
