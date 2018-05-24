import { Component } from '@angular/core';
import { Article } from './article/article.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  articles: Article[];

  constructor() {
  	this.articles = [
  		new Article('Angular 1', 'http://angular.io', 7),
  		new Article('Angular 2', 'http://angular.io', 20),
  		new Article('Angular 4', 'http://angular.io', 22)
  	]
  }

  addArticle(title: HTMLInputElement, link: HTMLInputElement): boolean {
    console.log(`adding article: ${title.value} and link: ${link.value}`)
    this.articles.push(new Article(title.value, link.value));
    title.value = '';
    link.value = '';
    return false
  }

  sortedArticles(): Article[] {
    return this.articles.sort((a: Article, b: Article) => b.votes - a.votes);
  }
}
