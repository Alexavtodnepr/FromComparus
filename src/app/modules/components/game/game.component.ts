import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../models/item";
import {GameLogicService} from "../../services/game-logic.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameLogicService]
})
export class GameComponent implements OnInit, OnDestroy {
  public form: FormGroup | any;
  public cells: number[] = new Array(10);
  public rows: number[] = new Array(10);
  public scoreUser: any[] = [];
  public scoreComp: any[] = [];
  public item: Item | any;
  public theEnd: boolean = false;
  public winner: string = '';
  private subscription: Subscription | any;
  private inputValue: number = 0;

  constructor(public gameLogicService: GameLogicService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      delay: new FormControl('' || 100, [Validators.required,
        Validators.min(100)])
    });
  }

  // добавляем красный цвет еще одним перебором с заданным интервалом пользователем
  generateRedItems(timer: number){
    if(this.scoreComp.length >= 10 || this.scoreUser.length >= 10){
      this.gameLogicService.stopArray = [];
    }else {
      this.gameLogicService.generateItems(1)
        .forEach((e) => {
          const redItemInterval = setInterval(() => {
            if (this.scoreComp.length >= 10 || this.scoreUser.length >= 10) {
              this.theEndGame();
              clearInterval(redItemInterval);
              return
            } else if (e.color === 'yellow' && e.click === false && this.scoreComp.length <= 10) {
              e.color = 'red';
              this.scoreComp.push(e);
              this.generateRedItems(timer)
            }
          }, timer)
        });
    }
  }

//Обработка событий и добавление зеленых ячеек
  clickThisItem(item: Item) {
    const timer = +this.submit().delay;
    if(item.color == 'red' || item.color === 'green' || this.scoreUser.length >= 10 || this.winner == 'Computer'){
      return;
    }else if ( item.color === 'yellow' && item.click === false) {
      this.scoreUser.push(item);
      item.color = 'green';
      this.generateRedItems(timer);
    }
  }

//Старт игры
  startGameComponent(){
    this.theEnd = false;
    this.scoreComp = [];
    this.scoreUser = [];
    this.gameLogicService.items = [];
    this.winner = '';
    const gameValue = +this.submit().delay;
    console.log('Game has been started', gameValue + ' ms speed');
    if(!this.theEnd){
      this.generateRedItems(gameValue);
    }
  }

//Конец игры
  theEndGame(){
    if(this.scoreUser.length == 10 || this.scoreComp.length == 10) {
      this.theEnd = true;
      this.whoIsWinner();
    }
  }

  //Определение победителя
  whoIsWinner(){
    if(this.scoreUser.length > this.scoreComp.length){
      this.winner = 'User';
    }else{
      this.winner = 'Computer';
    }
  }

  submit() {
    return this.inputValue = {...this.form.value};
  }

  //Установка стилей
  getStyles(item: Item){
    const top = (item.row * 55 - 50) + 'px';
    const left = (item.col * 55 - 50) + 'px';
    return { top : top, left, 'background-color': item.color}
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
