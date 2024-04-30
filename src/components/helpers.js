// For processing a video we need a {"status": true/false "url": "url"} object to be returned.

export const processUrl = async (url) => {
  var putIOUrlRegExOld = new RegExp(
    "^https://app.put.io/a-gift-from/(.*)/(.*)",
    "i",
  );
  var putIOUrlRegExNew = new RegExp(
    "^https://app.put.io/exclusive-access/([A-Za-z0-9]+)",
    "i",
  );
  var youtubeUrlRegEx = new RegExp(
    "^(http(s)?://)?((w){3}.)?youtu(be|.be)?(.com)?/.+",
    "i",
  );

  var urlMatchPutIOOld = putIOUrlRegExOld.exec(url);
  var urlMatchPutIONew = putIOUrlRegExNew.exec(url);
  var urlMatchYoutube = youtubeUrlRegEx.exec(url);

  if (urlMatchPutIOOld && urlMatchPutIOOld[2]) {
    return await getPutIOVideoUrl(urlMatchPutIOOld[2]);
  } else if (urlMatchPutIONew && urlMatchPutIONew[1]) {
    return await getPutIOVideoUrl(urlMatchPutIONew[1]);
  } else if (urlMatchYoutube) {
    return await getYoutubeVideoUrl(url);
  } else {
    return await checkValidVideoFile(url);
  }
};

// const getPutIOVideoUrl = async (oauthToken) => {
//   var apiUrl =
//     "https://api.put.io/v2/files/public?codecs_parent=1&media_info_parent=1&mp4_status_parent=1&mp4_stream_url_parent=1&oauth_token=" +
//     oauthToken +
//     "&stream_url_parent=1&video_metadata_parent=1";
//   var apiResponse = await fetch(apiUrl);
//   if (apiResponse.ok === false || apiResponse.status !== 200) {
//     return { status: false, url: null, error: "Probably an invalid link" };
//   }

//   var jsonData = await apiResponse.json();
//   // if the file is not an mp4 and or it needs to be converted
//   if (
//     jsonData.parent.extension !== "mp4" &&
//     jsonData.parent.need_convert === true
//   ) {
//     return { status: false, url: null, error: "There is no mp4 available yet" };
//   }
//   // if jsonData.parent.mp4_stream_url exists then use that, otherwise use jsonData.parent.stream_url
//   const audioTracks = jsonData.parent.media_info.streams.filter(
//     (stream) => stream.codec_type === "audio",
//   );

//   let hls_url = `https://api.put.io/v2/files/${jsonData.parent.id}/hls/media.m3u8?oauth_token=${oauthToken}&subtitle_languages=eng&original=0`;

//   let data = {
//     status: true,
//     url: jsonData.parent.mp4_stream_url
//       ? jsonData.parent.mp4_stream_url
//       : jsonData.parent.stream_url,
//     audioTracks: audioTracks,
//     hls_url: hls_url,
//   };


//   return data;
// };


const getPutId = async (oauthToken) => {
  const apiUrl = 'https://api.put.io/v2/public_share';
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Authorization': `token ${oauthToken}`
      }
    });
    if (!response.ok) {
      throw new Error('API response not OK');
    }
    const jsonData = await response.json();
    return { status: true, data: {
      id: jsonData.public_share.user_file.id,  // Adjusted assuming jsonData directly contains the file_id, change as per your API structure
      name: jsonData.public_share.user_file.name // Same as above
    }};
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: false, error: 'Failed to fetch data' };
  }
}

const getPutBreadcumbs = async (token, id) => {
  const apiUrl = `https://api.put.io/v2/public_share/files/list?breadcrumbs=1&codecs_parent=1&media_info_parent=1&mp4_status_parent=1&parent_id=${id}&video_metadata_parent=1`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Authorization': `token ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('API response not OK');
    }
    const jsonData = await response.json();
    // Correctly navigate the JSON structure based on your API's response structure
    return { status: true, data:
      jsonData.parent
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: false, error: 'Failed to fetch data' };
  }
}

const getPutIOVideoUrl = async (oauthToken) => {
  try {
    const putIDResponse = await getPutId(oauthToken);
    if (putIDResponse.status === false) {
      return {status: false};
    }
    const putId = putIDResponse.data.id;

    const breadcrumbsResponse = await getPutBreadcumbs(oauthToken, putId);
    if (breadcrumbsResponse.status === false) {
      return {status: false};
    }

    // console.log(breadcrumbsResponse.data.mp4_stream_url)

    const hls_url = `https://api.put.io/v2/files/${putId}/hls/media.m3u8?oauth_token=${oauthToken}&subtitle_languages=eng&original=${breadcrumbsResponse.data.mp4_stream_url  ? 0 : 1}`;
    return {
      status: true,
      hls_url: hls_url,
      url: breadcrumbsResponse.data.mp4_stream_url ? breadcrumbsResponse.data.mp4_stream_url : false
    };
  } catch (error) {
    console.error('Error preparing video URL:', error);
    return { status: false, error: 'Failed to prepare video URL' };
  }
};



const getYoutubeVideoUrl = async (url) => {
  return { status: false, error: "Error while fetching video URL" };
  // try {
  //   const response = await fetch(`https://movie-api.duckdns.org:3005/geturl?vidurl=${encodeURIComponent(url)}`, {
  //     mode: "cors",
  //   });
  //   const data = await response.json();
  //   if (response.status !== 200) {
  //     // Here we assume the API will return an error message under `message` key in case of an error
  //     return { status: false, error: data.message || "Unknown error occurred" };
  //   }
  //   return { status: true, url: data.data.url };
  // } catch (error) {
  //   console.error(error);
  //   return { status: false, error: "Error while fetching video URL" };
  // }
};

const checkValidVideoFile = async (url) => {
  return { status: true, url: url };
  // try {
  //   const response = await fetch(`https://movie-api.duckdns.org:3005/checkvideo?vidurl=${encodeURIComponent(url)}`, {
  //     mode: "cors",
  //   });
  //   if (!response.ok) {
  //     const errorResponse = await response.json();
  //     return { status: false, error: errorResponse.error || "Server error" };
  //   }
  //   const successResponse = await response.json();
  //   return { status: true, url: url, message: successResponse.message };
  // } catch (error) {
  //   return { status: false, error: "Network error" };
  // }
};
