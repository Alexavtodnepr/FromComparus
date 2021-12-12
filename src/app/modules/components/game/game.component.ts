import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../models/item";
import {GameLogicService} from "../../services/game-logic.service";
import {FormControl, FormGroup} from "@angular/forms";
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
  public item: Item | any;
  public theEnd: boolean = false;
  public winner: string = '';
  private subscription: Subscription | any;
  private interval: number | any;
  private showSpeedItems: number = 500;
  private inputValue: number = 0;

  constructor(public gameLogicService: GameLogicService) {}



  ngOnInit(): void {
    this.form = new FormGroup({
      delay: new FormControl('' || '1000')
    });
  }

  startGameComponent(){
    this.scoreUser.length = 0;
    this.gameLogicService.scoreComp.length = 0;
    this.gameLogicService.items = [];
    clearInterval(this.interval);
    this.theEnd = false;
      const gameValue = +this.submit().delay;
      console.log('Game has been started', gameValue + ' ms speed');
      this.interval = setInterval(() =>{
        this.gameLogicService.generateItems( 1, gameValue);
        this.theEndGame();
      }, this.showSpeedItems);
  }

  theEndGame(){
    this.whoIsWinner();
    if(this.scoreUser.length >= 10 || this.gameLogicService.scoreComp.length >= 10){
      this.theEnd = true;
      clearInterval(this.interval);
    }
    console.log(this.scoreUser.length, this.gameLogicService.scoreComp.length, this.theEnd )
  }

  whoIsWinner(){
    if(this.scoreUser.length > this.gameLogicService.scoreComp.length){
      this.winner = 'User';
    }else{
      this.winner = 'Computer';
    }
  }
  submit() {
    return this.inputValue = {...this.form.value};
  }

  getStyles(item: Item){
    const top = (item.row * 55 - 50) + 'px';
    const left = (item.col * 55 - 50) + 'px';
    return { top : top, left, 'background-color': item.color}
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clickThisItem(item: Item) {
    if ( item.color === 'yellow' && item.click === false) {
      this.scoreUser.push(item);
      item.color = 'green';
    }
    else if(item.color == 'red' || item.color === 'green'){
      return
    }
  }
}
