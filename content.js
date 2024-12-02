// Function to extract the main content of the page
function extractMainContent() {
  // Prioritize specific elements commonly used for main content
  const mainContentSelectors = ["article", "main", "section", "div"];
  let content = "";

  // Loop through selectors to find the first matching element with significant text
  for (const selector of mainContentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.trim().length > 100) {
      content = element.innerText.trim();
      break;
    }
  }

  // Fallback to body text if no significant content is found
  if (!content) {
    console.warn("Main content not found. Falling back to document body.");
    content = document.body.innerText.trim();
  }

  return content;
}

// Function to send the extracted content to the background script for summarization
function sendContentForSummarization() {
  const mainContent = extractMainContent();

  if (!mainContent || mainContent.length < 50) {
    console.error("Insufficient content found for summarization.");
    alert("Unable to extract meaningful content from this page for summarization.");
    return;
  }

  // Send the content to the background script
  chrome.runtime.sendMessage(
    { action: "summarize", content: mainContent },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError);
        alert("An error occurred while summarizing the content. Please try again.");
        return;
      }

      // Handle the response
      if (response.error) {
        console.error("Error in summarization:", response.error);
        alert(`Summarization failed: ${response.error}`);
      } else if (response.summary) {
        console.log("Summary received:", response.summary);
        displaySummaryPopup(response.summary);
      }
    }
  );
}

// Function to display the summary in a simple popup overlay
function displaySummaryPopup(summary) {
  // Create the popup container
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "10%";
  popup.style.left = "10%";
  popup.style.width = "80%";
  popup.style.height = "auto";
  popup.style.backgroundColor = "white";
  popup.style.border = "1px solid black";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  popup.style.zIndex = "10000";
  popup.style.overflowY = "auto";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.fontSize = "16px";

  // Add the summary text
  const summaryText = document.createElement("p");
  summaryText.textContent = summary;
  popup.appendChild(summaryText);

  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = "20px";
  closeButton.style.padding = "10px";
  closeButton.style.fontSize = "14px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => popup.remove();
  popup.appendChild(closeButton);

  // Append the popup to the document
  document.body.appendChild(popup);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarizePageContent") {
    console.log("SummarizePageContent action received in content.js");
    const mainContent = extractMainContent();

    if (!mainContent || mainContent.length < 50) {
      console.error("Insufficient content for summarization.");
      sendResponse({ error: "Insufficient content found for summarization." });
      return;
    }

    console.log("Extracted Content:", mainContent);
    sendResponse({ content: mainContent });
  }
});

// Function to extract the main content of the web page
function extractMainContent() {
  const mainSelectors = ["article", "main", "section", "div"];
  for (const selector of mainSelectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.trim().length > 100) {
      return element.innerText.trim();
    }
  }

  // Fallback to body text if no main content is found
  return document.body.innerText.trim();
}


