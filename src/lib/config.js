// export const API_ENDPOINT = "http://192.168.0.102:8000/";
export const API_ENDPOINT = "http://192.168.29.187:8000/";
// export const API_ENDPOINT = "http://192.168.0.119:8004/";
// export const API_ENDPOINT = "https://api.ishanadistributors.com/";
export const API_TOKEN = "engguergi09ertgiojg";
export const capitalizeText = (text) => {
  if (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    // Handle the case when text is undefined or null
    return "";
  }
};
