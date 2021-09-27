import { Component,OnInit } from '@angular/core';
import {Players} from './models/Players';
import { NgxSpinnerService } from "ngx-spinner";
import {ApiserverService} from './Services/apiserver.service';
import Swal from 'sweetalert2'
import { Movements } from './models/Movements';
import { ListRound } from './models/ListRound';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService,private _SERVER: ApiserverService) {}
  title = 'frontend-xp';
  public form : any = {
    player1 : '',
    player2 : ''
  };
  public winner : string = ''; //resultado ganador general
  public steps : any = { // guarda los pasos para cada formulario a medida que avanza el jeugo
    starGame : true,
    player1Move : false,
    finish : false
  };
  public gameid : number = 0
  public turno : number = 0
  public numberRound : number = 1;
  public disabledButton : any = {
    button_addPlayers : true
  }
  public Players : Players[] = [];
  public Movements : Movements[] = [];
  public ListRound : ListRound[] = [];


  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
  }


  addPlayers() : void{
    this.disabledButton.button_addPlayers = false;
    this.spinner.show();
    let pl : string[] = [this.form.player1,this.form.player2];
    this._SERVER.crearPlayers(pl).subscribe(data=>{
      let result = Object.entries(data);
      this.Players = result[1][1]; 
      console.log("Jugadores->",this.Players)
      this.startGame();
    },
    (error)=>{
      Swal.fire({
        title: 'Error!',
        text: 'La solicitud ha tenido algunos errores, estamos afinando detalles!!',
        icon: 'error',
        confirmButtonText: 'Cool'
      });
      this.disabledButton.button_addPlayers = true;
      this.spinner.hide();
    });
  }

  startGame(): void{
    this._SERVER.createGame().subscribe(data=>{
      this.spinner.hide();
      let result = Object.entries(data);
      this.gameid = result[1][1];
      this.steps.starGame = false;
      this.steps.player1Move = true;  
    },
    error =>{
      this.spinner.hide();
      Swal.fire({
        title: 'Error!',
        text: 'La solicitud ha tenido algunos errores, estamos afinando detalles!!',
        icon: 'error',
        confirmButtonText: 'Cool'
      }); 
    });
  }

  juego(movimiento:number){
    this.Movements.push({move : movimiento, playerid : this.Players[this.turno].id});
    this.ActivateSpinner(500);
    if(this.turno > 0){
      //Enviavamos peticion  
      let dat = {
        movimientos : this.Movements,
        gameid : this.gameid
      }
      this._SERVER.createMovements(dat as any).subscribe(data=>{
        this.spinner.hide();
        let result = Object.entries(data);
        this.ListRound.push(result[1][1]);
        this.turno = 0;
        this.numberRound = this.numberRound + 1;
        this.Movements = [];
        let ganador = this.buscarUsuario(result[1][1].playerid);
        Swal.fire({
          title: 'Resultado',
          text: ganador == 'Empate' ? 'Se ha declarado empate': 'El ganador es '+ganador,
          icon: 'success',
          confirmButtonText: 'Cool'
        });
        this.evaluarGanadorGeneral(this.ListRound);
      },
      error=>{
        Swal.fire({
          title: 'Error!',
          text: 'La solicitud ha tenido algunos errores, estamos afinando detalles!!',
          icon: 'error',
          confirmButtonText: 'Cool'
        });
        
      })     
    }else{
      this.turno = this.turno + 1;
    }
    
  }

  buscarUsuario(playerid?: number): string{
    if(playerid == null){
      return "Empate";
    }else{
      return this.Players.filter(x=>x.id == playerid)[0]?.players
    }
  
  }

  evaluarGanadorGeneral(result:ListRound[]):void{
      let player1 = result.filter(x=>x.playerid == this.Players[0].id).length;
      let player2 = result.filter(x=>x.playerid == this.Players[1].id).length;
      if(player1 > 2){
        //gano el 1
        this.steps.player1Move = false;
        this.steps.finish = true;
        this.winner = this.Players[0].players;
      }else if(player2 > 2){
        //gano el 2
        this.steps.player1Move = false;
        this.steps.finish = true;
        this.winner = this.Players[1].players;
      }
      
      
  }

  ActivateSpinner(second:number):void{
    this.spinner.show();

    setTimeout(() => {
      
      this.spinner.hide();
    }, second);
  }

  revancha():void{
    this.steps.finish = false;
    this.steps.player1Move = true;
    this.reiniciarValores();
    this.startGame();
  }

  reiniciarValores():void{
    this.numberRound = 1;
    this.ListRound = [];
    this.turno = 0;

  }

  nuevoJuego():void{
    this.steps.player1Move = false;
    this.steps.finish = false;
    this.steps.starGame = true;
    this.form.player1 = '';
    this.form.player2 = '';
    this.disabledButton.button_addPlayers = true;
  
    this.Players = [];
    this.reiniciarValores();
  }
}
