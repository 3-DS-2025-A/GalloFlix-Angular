import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  constructor(
    private service: MovieApiService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  media: any;
  trailers: any = [];
  cast: any = [];

  ngOnInit(): void {
    let id = this.router.snapshot.paramMap.get('id');
    let type = this.router.snapshot.paramMap.get('type');
    this.getMedia(type, id);
  }

  getMedia(type: any, id: any) {
    this.service.mediaDetails(type, id).subscribe((result) => {
      //console.log(result);
      this.media = result;
    });

    this.service.mediaTrailers(type, id).subscribe((result) => {
      //console.log(result);
      this.trailers = result.results;
    });

    this.service.mediaCast(type, id).subscribe((result) => {
      //console.log(result);
      this.cast = result.cast;
    });
  }

  getSafeUrl(key: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + key
    );
  }

}
