import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {

  constructor(
    private service: MovieApiService,
    private router: ActivatedRoute
  ) {}

  person: any;

  ngOnInit(): void {
    let id = this.router.snapshot.paramMap.get('id');
    this.getPerson(id);
  }

  getPerson(id: any) {
    this.service.personDetails(id).subscribe((result) => {
      //console.log(result);
      this.person = result;
    })
  }

}
