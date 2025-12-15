const toggleBtn = document.getElementById("toggleBtn");
const saveTimeBtn = document.getElementById("saveTime");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");

// Load saved settings
chrome.storage.sync.get(
  ["enabled", "startHour", "endHour"],
  (res) => {
    const enabled = res.enabled !== false;
    toggleBtn.textContent = enabled ? "Disable Focus Mode" : "Enable Focus Mode";
    startInput.value = res.startHour ?? "";
    endInput.value = res.endHour ?? "";
  }
);

// Toggle focus mode
toggleBtn.addEventListener("click", () => {
  chrome.storage.sync.get(["enabled"], (res) => {
    const newState = !(res.enabled !== false);
    chrome.storage.sync.set({ enabled: newState });
    toggleBtn.textContent = newState
      ? "Disable Focus Mode"
      : "Enable Focus Mode";
  });
});

// Save study hours
saveTimeBtn.addEventListener("click", () => {
  const startHour = Number(startInput.value);
  const endHour = Number(endInput.value);

  chrome.storage.sync.set({ startHour, endHour });
  alert("Study hours saved!");
});
