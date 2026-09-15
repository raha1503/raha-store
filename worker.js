export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle browser CORS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // GET all products
    if (url.pathname === "/api/products" && request.method === "GET") {
      try {
        const result = await env.DB
          .prepare("SELECT * FROM products ORDER BY id DESC")
          .all();

        return Response.json(result.results, {
          headers: corsHeaders
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // ADD a new product
    if (url.pathname === "/api/products" && request.method === "POST") {
      try {
        const product = await request.json();

        if (!product.name || product.price === undefined || !product.category) {
          return Response.json(
            {
              success: false,
              error: "Name, price and category are required"
            },
            {
              status: 400,
              headers: corsHeaders
            }
          );
        }

        const result = await env.DB
          .prepare(`
            INSERT INTO products
            (name, price, category, description, stock, sizes, colors, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            product.name,
            Number(product.price),
            product.category,
            product.description || "",
            Number(product.stock || 0),
            product.sizes || "",
            product.colors || "",
            product.images || ""
          )
          .run();

        return Response.json(
          {
            success: true,
            id: result.meta.last_row_id
          },
          {
            headers: corsHeaders
          }
        );
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // API status
    if (url.pathname === "/" || url.pathname === "/api") {
      return Response.json(
        {
         
