import "dotenv/config";
import fetch from "node-fetch";

const BASE64_BASIC_AUTH = `Basic ${Buffer.from(
  `${process.env.CRAWLER_USER_ID}:${process.env.CRAWLER_API_KEY}`
).toString("base64")}`;

const CRAWLER_ID = "c9ce8d38-5794-48bd-be81-10f4e812bf96";

async function reindex(crawlerId) {
  console.info(`Triggering reindex on ${crawlerId}`);

  const res = await fetch(
    `${process.env.CRAWLER_API_BASE_URL}/crawlers/${crawlerId}/reindex`,
    {
      method: "POST",
      headers: {
        Authorization: BASE64_BASIC_AUTH,
        "Content-Type": "application/json",
      },
    }
  );
  const jsonResponse = await res.json();
  // Each success response will look like: { taskId: '18bf6357-fbad-42b2-9a0f-d685e25a24f9' }
  // Use the '/crawlers/{id}/tasks/{taskId}' endpoint to get the status of the task

  console.log("reindex response", jsonResponse);
  return jsonResponse.taskId;
}

async function monitorForTaskCompletion(crawlerId, taskId) {
  let taskPending = true;

  while (taskPending) {
    const res = await fetch(
      `${process.env.CRAWLER_API_BASE_URL}/crawlers/${crawlerId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: BASE64_BASIC_AUTH,
          "Content-Type": "application/json",
        },
      }
    );
    const jsonResponse = await res.json();
    console.log("monitor response", jsonResponse);
    taskPending = jsonResponse.pending;

    // Wait 5 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function run() {
  // Trigger reindexing of crawler.
  const taskId = await reindex(CRAWLER_ID);

  // Monitor crawler until completed
  await monitorForTaskCompletion(CRAWLER_ID, taskId);

  console.info("Crawler reindexing complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
