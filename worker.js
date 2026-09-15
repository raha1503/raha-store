export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET products
    if (url.pathname === "/api/products" && request.method === "GET") {
      const result = await env.DB.prepare(
        "SELECT * FROM products ORDER BY id DESC"
      ).all();

      return Response.json(result.results, {
        headers: corsHeaders
      });
    }

    // ADD product
    if (url.pathname === "/api/products" && request.method === "POST") {
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
      }, {
        headers: corsHeaders
      });
    }

    return new Response("RAHA API is working ✅", {
      headers: corsHeaders
    });
  }
};
