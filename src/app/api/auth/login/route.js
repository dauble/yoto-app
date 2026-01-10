// Yoto OAuth Login
export async function GET() {
  const authUrl = "https://login.yotoplay.com/authorize";
  const params = new URLSearchParams({
    audience: "https://api.yotoplay.com",
    scope: "offline_access",
    response_type: "code",
    client_id: process.env.YOTO_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  });
  
  return Response.redirect(`${authUrl}?${params.toString()}`);
}
