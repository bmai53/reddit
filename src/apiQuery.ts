import axios from "axios";

export interface IApiQuery {
  searchSubmission: boolean;
  author: string;
  title: string;
  searchTerm: string;
  subreddit: string;
  size: number;
  after: string;
  before: string;
  sort: string;
  sortType: string;
}

export interface IApiResult extends Array<any> {}

export const apiQuery = (data: IApiQuery): Promise<IApiResult> => {
  const apiEndPoint = data.searchSubmission
    ? "https://api.pushshift.io/reddit/search/submission"
    : "https://api.pushshift.io/reddit/search/comment";

  return axios
    .get(apiEndPoint, {
      params: {
        author: data.author.trim(),
        title: data.title.trim(),
        q: data.searchTerm.trim(),
        subreddit: data.subreddit.trim(),
        size: data.size,
        after: data.after,
        before: data.before,
        order: data.sort,
        sort: data.sortType,
      },
    })
    .then((response) => {
      // console.log(response.data.data)
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
