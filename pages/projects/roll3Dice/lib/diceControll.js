class DiceControll {

    constructor(){
        this.dice = [];
        this.d4 = 0;
        this.d6 = 0;
        this.d8 = 0;
        this.d10 = 0;
        this.d12 = 0;
        this.d20 = 0;
    }

    getDices(){
        return this.dice;
    }

    cleanDices(){
        this.dice.splice(0, this.dice.length);
    }

    getD4  = _ => this.d4;
    getD6  = _ => this.d6;
    getD8  = _ => this.d8;
    getD10 = _ => this.d10;
    getD12 = _ => this.d12;
    getD20 = _ => this.d20;

    // Add dices

    addD4(){
        let die = new DiceD4({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d4++;
    }
    
    addD6(){
        let die = new DiceD6({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d6++;
    }
    
    addD8(){
        let die = new DiceD8({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d8++;
    }
    
    addD10(){
        let die = new DiceD10({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d10++;
    }
    
    addD12(){
        let die = new DiceD12({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d12++;
    }
    
    addD20(){
        let die = new DiceD20({
            size: 2.5,
            backColor: '#212121',
            fontColor: '#ffffff'
        });
        this.dice.push(die);    
        this.d20++;
    }

    // Remove dices
    removeDiceByType(type){
        let index = this.dice.findIndex(e => {
            // console.log(e.constructor.name);
            return e.constructor.name === type;            
        });
        
        if(index > -1){
            this.dice.splice(index, 1);
            return true;
        }else{
            console.log(`não possui ${type}.`);
            return false;
        }
    }

    subD4(){          
        if(this.removeDiceByType('DiceD4'))
            this.d4--;
    }
    
    subD6(){
        if(this.removeDiceByType('DiceD6'))
            this.d6--;
    }
    
    subD8(){        
        if(this.removeDiceByType('DiceD8'))
            this.d8--;
    }
    
    subD10(){
        if(this.removeDiceByType('DiceD10'))
            this.d10--;
    }
    
    subD12(){
        if(this.removeDiceByType('DiceD12'))
            this.d12--;
    }
    
    subD20(){
        if(this.removeDiceByType('DiceD20'))
            this.d20--;
    }

}