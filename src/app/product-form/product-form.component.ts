import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  phoneForm: FormGroup;
  value: number = 1;

  ngOnInit() {
     /* Initiate the form structure */
     this.phoneForm = this.fb.group({
      phone:['',[Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
      phones: this.fb.array([this.fb.group({phone:['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],  })])
    })

  }
  get phonePoints() {
    return this.phoneForm.get('phones') as FormArray;
  }

  addSellingPoint() {
    this.phonePoints.push(this.fb.group({phone:''}));
    this.value += 1;
  }

  deleteSellingPoint(index) {
    this.phonePoints.removeAt(index);
    this.value -= 1;
  }

  save(){
    console.log(this.phonePoints.value);
  }

  
}
