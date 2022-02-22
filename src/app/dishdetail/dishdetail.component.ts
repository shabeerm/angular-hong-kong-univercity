import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.dishservice.getDish(id).subscribe((dish => this.dish = dish));

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['', [Validators.required]],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    console.log(this.commentForm.value);
    const newComment = this.commentForm.value;
    newComment.date = new Date();
    this.dish.comments.push(newComment)
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }

  goBack(): void {
    this.location.back();
  }

}
