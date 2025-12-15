function isWithinStudyTime(start, end) {
  if (start == null || end == null) return true;
  const hour = new Date().getHours();
  return hour >= start && hour < end;
}

function applyFocusMode() {
  chrome.storage.sync.get(
    ["enabled", "startHour", "endHour"],
    (res) => {
      const enabled = res.enabled !== false;
      if (!enabled) return;

      if (!isWithinStudyTime(res.startHour, res.endHour)) return;

      const isSearchPage = window.location.href.includes("/results");

      // 🟢 HOME PAGE → Focus UI + Search input
      if (!isSearchPage) {
        document.body.innerHTML = `
          <div style="
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 18px;
            background: #0f0f0f;
            color: #00ff99;
            font-family: Arial, sans-serif;
            text-align: center;
          ">
            <h1>📚 Focus Mode ON</h1>
            <p>Search only what you want to study</p>

            <input
              id="focus-search"
              type="text"
              placeholder="Search study videos..."
              style="
                width: 320px;
                padding: 14px 16px;
                border-radius: 30px;
                border: none;
                outline: none;
                font-size: 16px;
              "
            />

            <button
              id="search-btn"
              style="
                padding: 12px 28px;
                border-radius: 30px;
                border: none;
                font-size: 15px;
                cursor: pointer;
                background: #00ff99;
                color: #000;
                font-weight: bold;
              "
            >
              Search
            </button>
          </div>
        `;

        const input = document.getElementById("focus-search");
        const button = document.getElementById("search-btn");

        function doSearch() {
          const query = input.value.trim();
          if (query) {
            window.location.href =
              "https://www.youtube.com/results?search_query=" +
              encodeURIComponent(query);
          }
        }

        button.addEventListener("click", doSearch);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") doSearch();
        });

      } 
      // 🟢 SEARCH PAGE → Hide sidebar only
      else {
        const style = document.createElement("style");
        style.innerHTML = `
          #guide-renderer {
            display: none !important;
          }
          ytd-page-manager {
            margin-left: 0 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  );
}

applyFocusMode();
window.addEventListener("yt-navigate-finish", applyFocusMode);
