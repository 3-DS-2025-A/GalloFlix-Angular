import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://api.themoviedb.org/3";
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmNlMzA4MDA5MTM4YzExYmQ1ZWMxNTA4NmY2ODQ4MyIsIm5iZiI6MTYyMzE5OTUzNi41MzksInN1YiI6IjYwYzAwZjMwNWIxMjQwMDA3YTc0N2IyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kEm9KuWOTvqNYEW1r4xFOWQ7g7SbsWupIiMss_L3gvk'
    }
  };

  // Banner de Midias da Semana
  bannerApiData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/all/week?language=pt-br`, this.options);
  }

  // Filmes em Destaque do Dia
  trendingMovieApiData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/day?language=pt-br`, this.options)
  }

  // Séries em Destaque do Dia
  trendingSerieApiData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/tv/day?language=pt-br`, this.options)
  }

  // Filmes de Ação mais Populares
  popularActionMovieApiData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?language=pt-br&with_genres=28&sort_by=popularity.desc`, this.options)
  }

  // Detalhes do Filme ou Série
  mediaDetails(type: any, value: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}/${value}?language=pt-br`, this.options);
  }

  // Trailers do Filme ou Série
  mediaTrailers(type: any, value: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}/${value}/videos?language=pt-br`, this.options);
  }

  // Elenco do Filme ou Série
  mediaCast(type: any, value: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}/${value}/credits?language=pt-br`, this.options);
  }

  // Buscar um ator ou atriz
  personDetails(value: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${value}?language=pt-br`, this.options);
  }
}
