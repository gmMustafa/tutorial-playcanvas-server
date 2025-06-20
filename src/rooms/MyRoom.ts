import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

    maxClients = 5;

    onCreate(options: any) {
        this.setState(new MyRoomState());

        this.onMessage("updatePosition", (client, data) => {
            console.log("update received -> ");
            console.debug(JSON.stringify(data));
            const player = this.state.players.get(client.sessionId);
            player.x = data["x"];
            player.y = data['y'];
            player.z = data["z"];
        });
       
      
        this.onMessage("chat", (client, message) => {    
        
            this.broadcast("chat", {
            sessionId: client.sessionId,
            message: message
    
         }, { except: client });            
        
        });
      
      
        this.onMessage("mouseMove", (client, message) => {

          this.broadcast("mouseMove", {
          sessionId: client.sessionId,
          message: message
    
          }, { except: client });

        });
      
      
       this.onMessage("jetFire", (client, message) => {

          this.broadcast("jetFire", {
          sessionId: client.sessionId,
          message: message
    
          }, { except: client });

        });
      
       this.onMessage("healthDamage", (client, message) => {

          this.broadcast("healthDamage", {
          sessionId: client.sessionId,
          message: message
    
          }, { except: client });

        });
      
        this.onMessage("userData", (client, message) => {

          this.broadcast("userData", {
          sessionId: client.sessionId,
          message: message
    
          }, { except: client });

        });
      
}

    onJoin(client: Client, options: any) {
        // Randomize player position on initializing.
        const newPlayer = new Player();
        newPlayer.x = Math.random() * 7.2 - 3.6;
        newPlayer.y = 1.031;
        newPlayer.z = Math.random() * 7.2 - 3.6;
        this.state.players.set(client.sessionId, newPlayer);
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {
        this.state.players.delete(client.sessionId);
        console.log(client.sessionId, "left!");
    }


    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}