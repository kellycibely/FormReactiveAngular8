import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  phoneForm: FormGroup;
  value: number = 1;
  ids: Array<any> = [];
  id_atual;
  contains;
  valueMaximo;
  ValueMinimum;
  paymentType;
  idDeals: number;
  idAux: number;

  //forma de pagamentos
  dinheiro: boolean = false;
  cartao: boolean = false;
  carteira: boolean = false;
  valegas: boolean = false;
  creditoCliente: boolean = false;
  debito: boolean = false;
  cartaoMaster: boolean = false;

  //count pagamentos
  dinheiroCount: number = 0;
  cartaoCount: number = 0;
  carteiraCount: number = 0;
  valegasCount: number = 0;
  creditoClienteCount: number = 0;
  debitoCount: number = 0;
  cartaoMasterCount: number = 0;

  finalDeals: Array<{id: number, value: string, minimumValue: string, paymentType: string}> = [] //array de saida
  deals: Array<{id: number, value: string, minimumValue: string, paymentType: string}> = [ //array que bem do banco
    {id: 1887, value: '10', minimumValue: '12' , paymentType: '0'},
    {id: 1888, value: '10', minimumValue: '12' , paymentType: '1'},
    {id: 1889, value: '2', minimumValue: '3' , paymentType: '2'},
    {id: 1890, value: '9', minimumValue: '12' , paymentType: '3'},
    {id: 1891, value: '10', minimumValue: '12' , paymentType: '4'},
    {id: 1892, value: '2', minimumValue: '1' , paymentType: '5'},
]; 
  Newdeals: Array<{ //array para agrupar
    value: string,
    minimumValue: string,
    dinheiro: boolean,
    cartao: boolean,
    carteira: boolean,
    valegas: boolean,
    creditoCliente: boolean,
    debito: boolean,
    cartaoMaster: boolean
    }> = []; 
  

  ngOnInit() {
      this.phoneForm = this.fb.group({
      phones: this.fb.array([this.fb.group({value:[''],minimumValue:[''],
      dinheiro:[],cartao:[],valegas:[],debito:[],carteira:[],creditoCliente:[], cartaoMaster:[]})])
    })
    this.form();
  }

  get phonePoints() {
    return this.phoneForm.get('phones') as FormArray;
  }

  addSellingPoint() {
    this.phonePoints.push(this.fb.group({value:[''],minimumValue:[''],
    dinheiro:[false],cartao:[false],valegas:[false],debito:[false],carteira:[false],creditoCliente:[false], cartaoMaster:[false]}));
    this.value += 1;
  }

  deleteSellingPoint(index) {
    this.phonePoints.removeAt(index);
    this.value -= 1;
  }

  form(){
    this.phonePoints.removeAt(0);
    this.deals.forEach(item => { //foreach do banco
    
        this.id_atual = item.id; //verifica os ids para nao percorrer duas vezes o mesmo elemento
        if(this.ids.length != 0){
          this.contains = false;
          this.ids.forEach(id => {
            if(id == this.id_atual){
              this.contains = true;
            }
          });
          if(this.contains == true){
            return;
          }
        }

        this.valueMaximo = item.value;
        this.ValueMinimum = item.minimumValue;
        
        this.deals.forEach(item => { //forach agrupamento
          if(item.value == this.valueMaximo && item.minimumValue == this.ValueMinimum){
            this.ids.push(item.id); //catalogados

            switch(item.paymentType){
              case "0": this.dinheiro = true;
                break;
              case "1": this.valegas = true;
                break;
              case "2": this.debito = true;
                break;
              case "3": this.carteira = true;
                break;
              case "4": this.creditoCliente = true;
                break;
              case "5": this.cartaoMaster = true;
                break;
            }
          }
        });
        this.Newdeals.push({value: this.valueMaximo, 
                            minimumValue: this.ValueMinimum,
                            dinheiro: this.dinheiro,
                            cartao: this.cartao,
                            carteira: this.carteira,
                            valegas: this.valegas,
                            creditoCliente: this.creditoCliente,
                            debito: this.debito,
                            cartaoMaster: this.cartaoMaster
            });

        this.dinheiro = false; //limpa as variaveis
        this.cartao = false;
        this.carteira = false;
        this.valegas = false;
        this.creditoCliente = false;
        this.debito = false;
        this.cartaoMaster = false;

    });

    
    this.Newdeals.forEach(deals => {

      this.phonePoints.push(this.fb.group({value:[deals.value],minimumValue:[deals.minimumValue],
         dinheiro:[deals.dinheiro],cartao:[deals.cartao],valegas:[deals.valegas],debito:[deals.debito],carteira:[deals.carteira],creditoCliente:[deals.creditoCliente], cartaoMaster:[deals.cartaoMaster]}));
    })
    console.log(this.Newdeals);
  }

  findId(paymentType){ //retorna o id dos elementos
    this.idAux = null;
    this.deals.forEach(item =>{
      if(paymentType == item.paymentType){
        this.idAux = item.id;
      }
    });
    return this.idAux;
  }
  save(){ //desagrupa os itens 
    console.log(this.phonePoints.value);
    this.phonePoints.value.forEach(deals => {
      if(deals.dinheiro){
        this.dinheiroCount +=1;
        this.idDeals = this.findId(0);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "0"})
      }
      if(deals.valegas){
        this.valegasCount +=1;
        this.idDeals = this.findId(1);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "1"})
      }
      if(deals.debito){
        this.debitoCount +=1;
        this.idDeals = this.findId(2);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "2"})
      }
      if(deals.carteira){
        this.cartaoCount +=1;
        this.idDeals = this.findId(3);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "3"})
      }
      if(deals.creditoCliente){
        this.creditoClienteCount +=1;
        this.idDeals = this.findId(4);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "4"})
      }
      if(deals.cartaoMaster){
        this.cartaoMasterCount +=1;
        this.idDeals = this.findId(5);
        this.finalDeals.push({id: this.idDeals, value: deals.value, minimumValue: deals.minimumValue, paymentType: "5"})
      }
    });
    if(this.dinheiroCount > 1 ||
      this.valegasCount > 1 ||
      this.debitoCount > 1 ||
      this.cartaoCount > 1 ||
      this.creditoClienteCount > 1 ||
      this.cartaoMasterCount >1 ){
        console.log("Forma de pagamento repetido")
    }else{
      console.log(this.finalDeals);
    }
    this.finalDeals = []; //zerando os valores
    this.dinheiroCount = 0;
    this.cartaoCount = 0;
    this.carteiraCount = 0;
    this.valegasCount = 0;
    this.creditoClienteCount = 0;
    this.debitoCount = 0;
    this.cartaoMasterCount = 0;
  }
}
