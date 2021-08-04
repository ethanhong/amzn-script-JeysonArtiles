const REPLACE_WITH_YOUR_STORE_ID = "ENTER STORE ID AS A BACKUP IF YOU SO DESIRE";

localStorage.STORE_ID = window.location.href.split("store/")[1].split("/")[0] || REPLACE_WITH_YOUR_STORE_ID;
