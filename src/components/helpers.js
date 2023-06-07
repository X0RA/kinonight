export const processUrl = async (url) => {
  var urlRegEx = new RegExp("^https://app.put.io/a-gift-from/(.*)/(.*)", "i");
  var urlMatch = urlRegEx.exec(url);
  if (urlMatch && urlMatch[2]) {
    return await getPutIOVideoUrl(urlMatch[2]);
  } else {
    return url;
  }
};

const getPutIOVideoUrl = async (oauthToken) => {
  var apiUrl =
    "https://api.put.io/v2/files/public?codecs_parent=1&media_info_parent=1&mp4_status_parent=1&mp4_stream_url_parent=1&oauth_token=" +
    oauthToken +
    "&stream_url_parent=1&video_metadata_parent=1";
  var apiResponse = await fetch(apiUrl);
  var jsonData = await apiResponse.json();

  return jsonData.parent.mp4_stream_url;
};
