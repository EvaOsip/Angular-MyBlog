import {CommentsType} from "./comments.type";

export type ArticleType = {
  category: string,
  comments: CommentsType[],
  commentsCount: number,
  date: string,
  description: string,
  id: string,
  image: string,
  text: string,
  title: string,
  url: string,

}
