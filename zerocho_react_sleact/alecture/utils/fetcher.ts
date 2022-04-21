import axios from "axios";

const fetcher = async (url:string) => {
  // return await axios.get(url, {withCredentials : true,}).then((response) => response.data);
  return axios.get(url, {withCredentials : true,}).then((response) => response.data);
}

export default fetcher;