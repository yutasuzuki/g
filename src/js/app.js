class Animal {
  constructor(name = 'test') {
    this.name = name
  }

  say() {
    alert(this.name )
  }
}

const a = new Animal('dog');

a.say();