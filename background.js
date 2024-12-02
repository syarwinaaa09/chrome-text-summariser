// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarizeText") {
    handleSummarization(message.content)
      .then((summary) => sendResponse({ summary }))
      .catch((error) => {
        console.error("Summarization failed:", error);
        sendResponse({ error: error.message || "An unexpected error occurred." });
      });
    return true; // Indicates asynchronous response
  } else {
    console.warn(`Unknown action: ${message.action}`);
  }
});

// Function to handle summarization
async function handleSummarization(inputText) {
  try {
    const cleanedText = preprocessText(inputText);

    if (!cleanedText || cleanedText.length < 50) {
      throw new Error("Input text must contain at least 50 characters after preprocessing.");
    }

    if (cleanedText.length > 5000) {
      console.warn("Truncating input text to 5000 characters.");
      cleanedText = cleanedText.substring(0, 5000);
    }

    // Create the Summarizer API instance
    const summarizer = await ai.summarizer.create({
      type: "tl;dr",
      length: "short",
      sharedContext: "Summarizing user-provided text."
    });

    // Generate the summary
    const summary = await summarizer.summarize(cleanedText, {
      context: "This text is provided for summarization."
    });

    console.log("Generated Summary:", summary);
    return summary;
  } catch (error) {
    console.error("Error in handleSummarization:", error);
    if (error.name === "NotReadableError") {
      throw new Error("The API could not process the input text. Please simplify or revise the content.");
    }
    throw error; // Propagate other errors
  }
}

// Function to preprocess the input text
function preprocessText(inputText) {
  return inputText
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/[^a-zA-Z0-9 .,;:!?'"()\-]/g, "") // Remove unsupported characters
    .trim(); // Remove leading and trailing whitespace
}
