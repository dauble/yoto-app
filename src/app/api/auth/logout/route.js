// Yoto Logout
import Configstore from "configstore";

const config = new Configstore("yoto-weather-card-tokens");

export async function POST() {
  try {
    config.delete("tokens");
    return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    console.error("Logout error:", error);
    return new Response("Logout failed", { status: 500 });
  }
}
