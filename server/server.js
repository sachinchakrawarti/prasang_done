import "dotenv/config";

import app from "./app.js";

// ==================================================
// CONFIG
// ==================================================

const PORT =
  Number(process.env.PORT) || 5000;

const HOST =
  process.env.HOST || "0.0.0.0";

// ==================================================
// START SERVER
// ==================================================

const server = app.listen(
  PORT,
  HOST,
  () => {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "        PRASANG API SERVER"
    );
    console.log(
      "======================================"
    );
    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );
    console.log(
      `❤️  Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      "======================================"
    );
    console.log("");
  }
);

// ==================================================
// SERVER ERROR
// ==================================================

server.on(
  "error",
  (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${PORT} is already in use.`
      );
    } else {
      console.error(
        "❌ Server error:",
        error
      );
    }

    process.exit(1);
  }
);

// ==================================================
// GRACEFUL SHUTDOWN
// ==================================================

function shutdown(signal) {
  console.log(
    `\n${signal} received. Shutting down...`
  );

  server.close(() => {
    console.log(
      "✅ Server closed."
    );

    process.exit(0);
  });
}

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);