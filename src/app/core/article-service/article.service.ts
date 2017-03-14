import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SearchResult } from './search-result.model';
import { Article } from './article.model';
import { Observable } from 'rxjs/Observable';
import { Cacheable } from 'rebirth-storage';
import { RebirthHttp, RebirthHttpProvider, GET, POST, DELETE, Query, Path, Body } from 'rebirth-http';


export abstract class ArticleService extends RebirthHttp {

  abstract getArticles(pageIndex, pageSize, keyword?: string): Observable<SearchResult<Article>>;

  abstract getArticleByUrl(articleUrl: string): Observable<Article>;

  abstract updateMarkdown(articleUrl: string, article: Article): Observable<any> ;

  abstract  deleteArticle(articleUrl: string): Observable<any> ;
}


@Injectable()
export class OnlineArticleService extends ArticleService {

  constructor(protected http: Http, protected rebirthHttpProvider: RebirthHttpProvider) {
    super();
  }

  @Cacheable({ pool: 'articles' })
  @GET('article')
  getArticles(@Query('pageIndex') pageIndex = 1,
              @Query('pageSize') pageSize = 10,
              @Query('keyword') keyword?: string): Observable<SearchResult<Article>> {
    return null;
  }

  @GET('article/:id')
  getArticleByUrl(@Path('id') articleUrl: string): Observable<Article> {
    return null;
  }

  @POST('article/:id')
  updateMarkdown(@Path('id') articleUrl: string, @Body article: Article): Observable<any> {
    return null;
  }

  @DELETE('article/:id')
  deleteArticle(@Path('id') articleUrl: string): Observable<any> {
    return null;
  }

}

@Injectable()
export class GithubArticleService extends ArticleService {

  constructor(protected http: Http, protected rebirthHttpProvider: RebirthHttpProvider) {
    super();
  }

  getArticles(pageIndex = 1, pageSize = 10, keyword?: string): Observable<SearchResult<Article>> {
    return this.innerGetArticles()
      .map(res => {
        const result = res.result || [];
        const startIndex = (pageIndex - 1 ) * pageSize;
        return {
          pageSize,
          pageIndex,
          total: result.length,
          result: result.slice(startIndex, startIndex + pageSize)
        };
      });
  }

  getArticleByUrl(articleUrl: string): Observable<Article> {
    return this.innerGetArticles()
      .map(res => {
        const result = res.result || [];
        return result.find(item => item.url === articleUrl);
      });
  }

  updateMarkdown(articleUrl: string, article: Article): Observable<any> {
    return null;
  }

  deleteArticle(articleUrl: string): Observable<any> {
    return null;
  }

  @Cacheable({ pool: 'articles' })
  @GET('articles.json')
  private  innerGetArticles(): Observable<SearchResult<Article>> {
    return null;
  }


}

export const REBIRTH_ARTICLE_SERVICE_PROVIDERS: Array<any> = [
  {
    provide: ArticleService,
    useClass: OnlineArticleService // environment.deploy === 'github' ? GithubArticleService : OnlineArticleService
  }
];

