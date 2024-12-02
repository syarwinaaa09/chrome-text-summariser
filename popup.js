// Elements
const inputText = document.getElementById("inputText");
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryOutput = document.getElementById("summaryOutput");
const errorOutput = document.getElementById("errorOutput");

// Helper: Display Summary
function displaySummary(summary) {
  summaryOutput.textContent = summary;
  summaryOutput.classList.remove("hidden");
  errorOutput.classList.add("hidden");
}

// Helper: Display Error
function displayError(error) {
  errorOutput.textContent = error;
  errorOutput.classList.remove("hidden");
  summaryOutput.classList.add("hidden");
}

// Function: Summarize Text
async function summarizeText() {
  const text = inputText.value.trim();
  if (!text) {
    displayError("Please enter text to summarize.");
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: "summarizeText",
      content: text
    });

    if (response.error) {
      displayError(response.error);
    } else if (response.summary) {
      displaySummary(response.summary);
    } else {
      displayError("Failed to summarize the text. Please try again.");
    }
  } catch (error) {
    console.error("Error during text summarization:", error);
    displayError("An unexpected error occurred. Please try again.");
  }
}

// Event Listener for Summarize Button
summarizeBtn.addEventListener("click", summarizeText);
