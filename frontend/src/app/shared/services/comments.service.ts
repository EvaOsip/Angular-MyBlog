import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentsType} from "../../../types/comments.type";
import {CommentActionType} from "../../../types/comment-action.type";
import {ActionType} from "../../../types/action.type";



@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private http: HttpClient) {
  }

  getComments(offset: number, articleId: string): Observable<{allCount: number, comments: CommentsType[]} | DefaultResponseType> {
    return this.http.get<{allCount: number, comments: CommentsType[]} | DefaultResponseType>(environment.apiHost + 'comments', {
      params: {offset: offset, article: articleId}
    });
  }

  getCommentsActions(commentId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.apiHost + 'comments/' + commentId + '/actions');
  }

  getAllCommentsActions(articleId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.apiHost + 'comments/article-comment-actions', {
      params: {articleId : articleId}
    });
  }

  addCommentTo(productId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiHost + 'comments', {
      text: text,
      article: productId,
    })
  }

  makeAction(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiHost + 'comments/' + commentId + '/apply-action', {
      action: action,
    })
  }
}
