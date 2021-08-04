// ==UserScript==
// @name         GET STORE ID
// @namespace    mailto:jeyartil@amazon.com
// @version      0.1
// @description  GET STORE ID
// @author       jeyartil
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/require/store_id.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/require/store_id.user.js
// @require      https://unpkg.com/hotkeys-js@3.8.7/dist/hotkeys.min.js
// ==/UserScript==

// EXAMPLE (COMO LINK): https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/dash
// STORE ID = f170be3c-eda4-43dd-b6bd-2325b4d3c719

const STORE_ID = () => {
  const REPLACE_WITH_YOUR_STORE_ID = "ENTER STORE ID AS A BACKUP IF YOU SO DESIRE";
  
  localStorage.STORE_ID = window.location.href.split("store/")[1].split("/")[0] || REPLACE_WITH_YOUR_STORE_ID;
}
