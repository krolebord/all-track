console.log("Triggering cron job with http request");
fetch("http://localhost:8788/cdn-cgi/mf/scheduled");
