import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieApiService } from '../../services/movie-api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(
    private service: MovieApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  result: any;
  searchQuery: string = '';

  ngOnInit(): void {

  }

  onSearch(): void {
    this.searchMedia();
  }

  searchMedia(): void {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.service.searchMedia(query, 1).subscribe(result => {
      console.log(result)
    })
  }
}
