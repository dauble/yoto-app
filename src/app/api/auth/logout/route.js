// Yoto Logout
import Configstore from "configstore";

const config = new Configstore("yoto-f1-card-tokens");

export async function POST() {
  try {
    config.delete("tokens");
    config.delete("f1CardId");
    config.delete("f1MyoCardId");
    return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Logout error:", error);
    return new Response("Logout failed", { status: 500 });
  }
}

export async function GET() {
  try {
    config.delete("tokens");
    config.delete("f1CardId");
    config.delete("f1MyoCardId");
    return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Logout error:", error);
    return new Response("Logout failed", { status: 500 });
  }
}
