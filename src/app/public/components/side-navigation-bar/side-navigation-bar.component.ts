import {Component, inject, Inject, OnInit} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {SourceListComponent} from "../../../news/components/source-list/source-list.component";
import {MatIcon} from "@angular/material/icon";
import {ArticleListComponent} from "../../../news/components/article-list/article-list.component";
import {FooterContentComponent} from "../footer-content/footer-content.component";
import {MatIconButton} from "@angular/material/button";

import {Source} from "../../../news/model/source.entity";
import {LogoApiService} from "../../../shared/services/logo-api.service";
import {NewsApiService} from "../../../news/services/news-api.service";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {Article} from "../../../news/model/article.entity";

@Component({
  selector: 'app-side-navigation-bar',
  standalone: true,
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    SourceListComponent,
    MatIcon,
    ArticleListComponent,
    FooterContentComponent,
    MatIconButton,
    MatSidenav,
    LanguageSwitcherComponent
  ],
  templateUrl: './side-navigation-bar.component.html',
  styleUrl: './side-navigation-bar.component.css'
})
export class SideNavigationBarComponent implements OnInit {
  sources: Array<Source> = [];
  articles: Array<Article> = [];

  private newsApi = inject(NewsApiService);
  private logoApi = inject(LogoApiService);

  searchArticlesForSource(source: any) {
    console.log(`selected source is: ${source.id}`);
    this.newsApi.getArticlesBySourceId(source.id)
      .subscribe((data: any) => {
        this.articles = data['articles'];
        this.articles.forEach((article: { source: { urlLogo: any; url: any; }; }) => {
          article.source.urlLogo = source.urlLogo;
          article.source.url = source.url;
        });
        console.log(this.articles);
      });
  }

  onSourceSelected(source: Source) {
    console.log(source.name);
    this.searchArticlesForSource(source);
  }

  ngOnInit(): void {
    this.newsApi.getSources()
      .subscribe((data: any) => {
        this.sources = data['sources'];
        this.sources.forEach((source: { urlLogo: string; }) =>
          source.urlLogo = this.logoApi.getUrlToLogo(source));
        console.log(this.sources);
        this.searchArticlesForSource(this.sources[0]);
      })
  }
}

