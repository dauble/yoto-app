// API Route to check TTS job status
import { checkJobStatus } from "@/services/yotoService";
import Configstore from "configstore";

const config = new Configstore("yoto-f1-card-tokens");

/**
 * Get stored access token
 */
function getAccessToken() {
  const tokens = config.get("tokens");
  if (!tokens || !tokens.accessToken) {
    return null;
  }
  return tokens.accessToken;
}

export async function GET(request) {
  try {
    // Check if user is authenticated
    const accessToken = getAccessToken();
    if (!accessToken) {
      return Response.json(
        {
          error: "Not authenticated. Please connect with Yoto first.",
          needsAuth: true,
        },
        { status: 401 }
      );
    }

    // Get jobId from query params
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return Response.json(
        {
          error: "Missing jobId parameter",
        },
        { status: 400 }
      );
    }

    // Check job status
    const jobStatus = await checkJobStatus(jobId, accessToken);

    return Response.json({
      success: true,
      job: jobStatus,
    });

  } catch (error) {
    console.error("Job status check error:", error);
    
    // Check if it's an auth error
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return Response.json(
        {
          error: "Authentication failed. Please reconnect with Yoto.",
          needsAuth: true,
        },
        { status: 401 }
      );
    }
    
    return Response.json(
      {
        error: error.message || "Failed to check job status",
      },
      { status: 500 }
    );
  }
}
