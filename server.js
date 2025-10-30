import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // your React app's origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const API_BASE_URL = "https://aws-api.sigmacomputing.com/v2";

app.post("/api/workspaces", async (req, res) => {
  const { clientId, clientSecret } = req.body;

  console.log("Incoming body:", req.body);

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: "Missing clientId or clientSecret" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "client_credentials");
    console.log(
      `${API_BASE_URL}/auth/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      },
      "mnjnb"
    );

    const tokenResponse = await axios.post(
      `${API_BASE_URL}/auth/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log("✅ Access Token:", accessToken);

    // 2️⃣ Fetch Workspaces
    const workspacesResponse = await axios.get(`${API_BASE_URL}/workspaces`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    const responseData = { ...workspacesResponse.data, accessToken };

    res.json(responseData);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
