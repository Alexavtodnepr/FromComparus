import {Injectable} from '@angular/core';
import {Item} from "../models/item";

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {
  private size = 10;
  private availableCells: number[] = [];
  public itemPaint: string = 'yellow';
  public stopArray: Item[] = [];


  //Проверка на заполнение и наличие пустых/не пустых ячеек
  private get emptyCells(): number[]{
    const notEmptyCells = this.notEmptyCells;
    return this.availableCells.filter(position => !notEmptyCells.includes(position));
  }
  private get notEmptyCells(): number[]{
     return this.items.map(item => item.row * 100 + item.col)
  }

  items: Item[] = [];

  constructor() {
    this.generateAvailableCells()
  }

  //запуск игры
  generateItems(length = 1){
  // генерируем ячейку в пустые места
    const positions: number[] = this.emptyCells
      .sort(() => Math.random() - 0.5)
      .slice( 0 , length);
    //склеиваем массивы с координатами
    return this.stopArray = this.items = [
      ...this.items,
      ...positions.map<Item>(position => ({
        col: position % 100,
        row: (position - position % 100) / 100,
        color: 'yellow',
        click: false
      }))
    ];
  }

  //вычисляем возможные ячейки
  generateAvailableCells(){
    for(let row = 1; row <= this.size; row++){
      for(let col = 1; col <= this.size; col++){
        this.availableCells.push(row * 100 + col);
      }
    }
  }
}
