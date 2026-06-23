import { connectDB } from "@/lib/database";
import { Product } from "@/database/models/Product";
import { uploadToCloudinary } from "@/helpers/uploadImg";

// POST /api/products/upload — create a product from a multipart form,
// uploading the image file to Cloudinary and storing only its URL.
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const img = formData.get("img");
    const name = formData.get("name")?.toString().trim() ?? "";
    const price = Number(formData.get("price"));

    if (!(img instanceof File) || img.size === 0) {
      return Response.json(
        { data: null, code: 400, message: "img file is required" },
        { status: 400 }
      );
    }
    if (name === "") {
      return Response.json(
        { data: null, code: 400, message: "name is required" },
        { status: 400 }
      );
    }
    if (Number.isNaN(price) || price < 0) {
      return Response.json(
        { data: null, code: 400, message: "price must be a number >= 0" },
        { status: 400 }
      );
    }

    // Convert the uploaded File into a Buffer Cloudinary can stream.
    const buffer = Buffer.from(await img.arrayBuffer());
    const imageUrl = await uploadToCloudinary(buffer, img.name);

    // Extended fields are optional; specs comes as a comma-separated string.
    const specsRaw = formData.get("specs")?.toString() ?? "";
    const specs = specsRaw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const stock = Number(formData.get("stock")) || 0;

    const product = await Product.create({
      name,
      price,
      image: imageUrl,
      description: formData.get("description")?.toString() ?? "",
      specs,
      stock,
    });

    return Response.json(
      { data: product, code: 201, message: "Product created with image" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
