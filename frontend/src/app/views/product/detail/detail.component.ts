import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {ArticleType} from "../../../../types/article.type";
import {CommentsType} from "../../../../types/comments.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {CommentsService} from "../../../shared/services/comments.service";
import {ActionType} from "../../../../types/action.type";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  relatedProducts: ProductType[] = [];
  product!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  comments: CommentsType[] = [];
  extraComments: CommentsType[] = [];
  isLogged: boolean = false;
  activeParams: ActiveParamsType = {categories: []};
  text: string = '';
  commentActionTypeLike: ActionType = ActionType.like;
  commentActionTypeDisLike: ActionType = ActionType.dislike;
  commentActionTypeViolate: ActionType = ActionType.violate;
  commentsCount: number = 0;
  offset: number = 3;
  isShowed: boolean = false;
  changedComment!: CommentsType;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private commentsService: CommentsService) {
    this.isLogged = this.authService.getLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['url']) {
        this.productService.getProduct(params['url'])
          .subscribe((data: ArticleType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.product = data as ArticleType;
            this.comments = this.product.comments;
            if (this.comments && this.comments.length > 0 && this.isLogged) {
              this.comments.forEach(comment => {
                this.commentsService.getCommentsActions(comment.id).subscribe((data: CommentActionType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    throw new Error((data as DefaultResponseType).message);
                  }
                  let dataItems =  data as CommentActionType[];
                  if (dataItems && dataItems.length > 0) {
                    comment.action = dataItems[0].action
                  }
                })
              })
            }
          })
        this.productService.getRelatedProducts(params['url'])
          .subscribe((data: ProductType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.relatedProducts = data as ProductType[];
          })
      }
    })
  }

  makeCommentAction(commentId: string, action: ActionType) {
    if (this.isLogged) {
      let changedComment = this.comments.find((item: CommentsType) => item.id === commentId);
      if (changedComment) {
        this.changedComment = changedComment;
      }

      if (action === ActionType.like) {
        this.makeLike(commentId)
      } else if (action === ActionType.dislike) {
        this.makeDisLike(commentId)
      } else if (action === ActionType.violate) {
        this.makeViolate(commentId)
      }
    } else {
      this._snackBar.open('Это действие могут выполнять только зарегистрированные пользователи')
    }
  }

  makeLike(commentId: string): void {
    if (this.changedComment.action) {
      if (this.changedComment.action === 'dislike') {
        this.commentsService.makeAction(commentId, ActionType.like).subscribe((data: DefaultResponseType) => {
          if (data && !data.error) {
            this.changedComment.likesCount += 1;
            this.changedComment.dislikesCount -= 1
            this.changedComment.action = ActionType.like
          } else {
            this._snackBar.open('Произошла ошибка. Реакция не отправлена')
          }
        })
      } else if (this.changedComment.action === 'like') {
        this.commentsService.makeAction(commentId, ActionType.like).subscribe((data: DefaultResponseType) => {
          if (data && !data.error) {
            this.changedComment.likesCount -= 1;
            this.changedComment.action = '';
          } else {
            this._snackBar.open('Произошла ошибка. Реакция не отправлена')
          }
        })
      }
    } else if (!this.changedComment.action) {
      this.commentsService.makeAction(commentId, ActionType.like).subscribe((data: DefaultResponseType) => {
        if (data && !data.error) {
          this.changedComment.likesCount += 1;
          this.changedComment.action = ActionType.like;
        } else {
          this._snackBar.open('Произошла ошибка. Реакция не отправлена')
        }
      })
    }
  }

  makeDisLike(commentId: string): void {
    if (this.changedComment.action) {
      if (this.changedComment.action === 'dislike') {
        this.commentsService.makeAction(commentId, ActionType.dislike).subscribe((data: DefaultResponseType) => {
          if (data && !data.error) {
            this.changedComment.dislikesCount -= 1;
            this.changedComment.action = ''
          } else {
            this._snackBar.open('Произошла ошибка. Реакция не отправлена')
          }
        })
      } else if (this.changedComment.action === 'like') {
        this.commentsService.makeAction(commentId, ActionType.dislike).subscribe((data: DefaultResponseType) => {
          if (data && !data.error) {
            this.changedComment.likesCount -= 1;
            this.changedComment.dislikesCount += 1;
            this.changedComment.action = ActionType.dislike;
          } else {
            this._snackBar.open('Произошла ошибка. Реакция не отправлена')
          }
        })
      }
    } else if (!this.changedComment.action) {
      this.commentsService.makeAction(commentId, ActionType.dislike).subscribe((data: DefaultResponseType) => {
        if (data && !data.error) {
          this.changedComment.dislikesCount += 1;
          this.changedComment.action = ActionType.dislike;
        } else {
          this._snackBar.open('Произошла ошибка. Реакция не отправлена')
        }
      })
    }
  }

  makeViolate(commentId: string): void {
    const storedData = localStorage.getItem('commentsWithViolate');
    const commentsWithViolateArray = storedData ? JSON.parse(storedData) : [];

    const handleViolate = () => {
      this.commentsService.makeAction(commentId, ActionType.violate).subscribe((data: DefaultResponseType) => {
        if (data && !data.error) {
          this._snackBar.open('Жалоба на комментарий отправлена');
          this.changedComment.isHasViolate = true;
          commentsWithViolateArray.push(commentId);
          localStorage.setItem('commentsWithViolate', JSON.stringify(commentsWithViolateArray));
        } else {
          this._snackBar.open('Произошла ошибка. Реакция не отправлена');
        }
      });
    }

    if (commentsWithViolateArray.includes(this.changedComment.id)) {
      this._snackBar.open('Жалоба на комментарий уже отправлена');
    } else {
      handleViolate();
    }
  }

  getMoreComments(articleId: string) {
    this.isShowed = true;
    this.commentsService.getComments(this.offset, articleId).subscribe((data: { allCount: number, comments: CommentsType[] } | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      let extraComments = data as { allCount: number, comments: CommentsType[] };
      if (extraComments) {
        this.isShowed = false;
        if (this.isLogged) {
          extraComments.comments.forEach(comment => {
            this.commentsService.getAllCommentsActions(articleId).subscribe((data : CommentActionType[] | DefaultResponseType)=> {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }
              let commentsData = data as CommentActionType[];
              if (commentsData && commentsData.length > 0) {
                commentsData.forEach((item: { comment: string, action: string }) => {
                  if (comment.id === item.comment) {
                    comment.action = item.action
                  }
                })
              }
            })
            this.comments.push(comment)
          })
        } else {
          extraComments.comments.forEach(comment => {
            this.comments.push(comment)
          })
        }
        this.offset += 10;
      }

    })
  }

  addComment() {
    if (this.text.length > 0) {
      this.commentsService.addCommentTo(this.product.id, this.text).subscribe((data: DefaultResponseType) => {
        if (!data.error) {
          this.productService.getProduct(this.product.url)
            .subscribe((data: ArticleType | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }
              this.comments = (data as ArticleType).comments;
              this.text = '';
            })
        } else {
          console.log(data.message);
          this._snackBar.open('Произошла ошибка');
        }
      })
    } else {
      this._snackBar.open('Вы пытаетесь опубликовать пустой комментарий')
    }
  }

  change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

}
