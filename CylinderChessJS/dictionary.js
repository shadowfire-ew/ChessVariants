// written by Caleb Erb-White
// defines a simple python-like dictionary

class dictionary{
  constructor(){
    this.keys=[];
    this.values=[];
  }
  putValue(key,value){
    if(!this.keys.includes(key)){
      this.keys.push(key);
      this.values.push(value);
    }
    else{
      let idx = this.keys.indexOf(key);
      this.values[idx] = value
    }
  }
  getValue(key){
    if(!this.keys.includes(key)){
      return(null);
    }
    else{
      let idx = this.keys.indexOf(key);
      return(this.values[idx]);
    }
  }
  delete(key){
    // removes the key and value from the dictionary
    if(this.keys.includes(key)){
      let ix = this.keys.indexOf(key);
      if(idx>=0){
        this.keys.slice(idx,1);
        this.values.slice(idx,1);
      }
    }
  }
}