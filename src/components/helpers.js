// For processing a video we need a {"status": true/false "url": "url"} object to be returned.

export const processUrl = async (url) => {
  var putIOUrlRegEx = new RegExp("^https://app.put.io/a-gift-from/(.*)/(.*)", "i");
  var youtubeUrlRegEx = new RegExp("^(http(s)?://)?((w){3}.)?youtu(be|.be)?(.com)?/.+", "i");

  var urlMatchPutIO = putIOUrlRegEx.exec(url);
  var urlMatchYoutube = youtubeUrlRegEx.exec(url);

  if (urlMatchPutIO && urlMatchPutIO[2]) {
    return await getPutIOVideoUrl(urlMatchPutIO[2]);
  } else if (urlMatchYoutube) {
    return await getYoutubeVideoUrl(url);
  } else {
    return await checkValidVideoFile(url);
  }
};

const getPutIOVideoUrl = async (oauthToken) => {
  var apiUrl =
    "https://api.put.io/v2/files/public?codecs_parent=1&media_info_parent=1&mp4_status_parent=1&mp4_stream_url_parent=1&oauth_token=" +
    oauthToken +
    "&stream_url_parent=1&video_metadata_parent=1";
  var apiResponse = await fetch(apiUrl);
  if (apiResponse.ok == false || apiResponse.status != 200) {
    return { status: false, url: null, error: "Probably an invalid link" };
  }
  var jsonData = await apiResponse.json();
  // if the file is not an mp4 and or it needs to be converted
  if (jsonData.parent.extension != "mp4" && jsonData.parent.need_convert == true) {
    return { status: false, url: null, error: "There is no mp4 available yet" };
  }
  // if jsonData.parent.mp4_stream_url exists then use that, otherwise use jsonData.parent.stream_url
  let data = {
    status: true,
    url: jsonData.parent.mp4_stream_url ? jsonData.parent.mp4_stream_url : jsonData.parent.stream_url,
  };
  return data;
};

const getYoutubeVideoUrl = async (url) => {
  try {
    const response = await fetch(`https://movie-api.duckdns.org:3005/geturl?vidurl=${encodeURIComponent(url)}`, {
      mode: "cors",
    });
    if (response.status !== 200) {
      return { status: false, error: "not a valid URL" };
    } else if (!response.ok) {
      throw new Error("Failed to fetch movie data");
    }
    const data = await response.json();
    return { status: true, url: data.url };
  } catch (error) {
    console.error(error);
  }
};

const checkValidVideoFile = async (url) => {
  try {
    const response = await fetch(`https://movie-api.duckdns.org:3005/checkvideo?vidurl=${encodeURIComponent(url)}`, {
      mode: "cors",
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      return { status: false, error: errorResponse.error || "Server error" };
    }
    const successResponse = await response.json();
    return { status: true, url: url, message: successResponse.message };
  } catch (error) {
    return { status: false, error: "Network error" };
  }
};
