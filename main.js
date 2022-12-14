// Selecionando o canvas
const canvas = document.querySelector('canvas')
//definindo tipo de jogo
const c = canvas.getContext('2d')
// modificando width e height do canvas
canvas.width = innerWidth
canvas.height = innerHeight

// criando class do player para herança
class Player {
  constructor(x, y, radius, color) {
    // propriedades de posicionamento
    this.x = x
    this.y = y
    // propriedades de estilização
    this.radius = radius
    this.color = color
  }
  // função para desenhar objetos criados
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

// criando classe de projetil ou shoot
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  //movimento e velocidade do projetil
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  //movimento e velocidade do projetil
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

// centralizando player
const x = canvas.width / 2
const y = canvas.height / 2

// criando player
const player = new Player(x, y, 15, 'white')
const projectiles = []
const enemies = []

//função enemy
function spawnEnemeis() {
  setInterval(() => {
    const radius = Math.random() * (50 - 10) + 10
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animationId
// função de animação
function animated() {
  animationId = requestAnimationFrame(animated)
  c.fillStyle = 'rgba(0 ,0 ,0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  projectiles.forEach((projectile, index) => {
    projectile.update()

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (dist - enemy.radius - projectile.radius < 1) {
        setTimeout(() => {
          enemies.splice(index, 1)
          projectiles.splice(projectileIndex, 1)
        }, 0)
      }
    })
  })
}

// evento de disparar projetil
addEventListener('click', event => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  )

  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4
  }

  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  )
})

animated()
spawnEnemeis()

//const projectile = new Projectile(
//  // captando posição x e y do mouse para apontar direção do projetil
//  canvas.width / 2,
//  canvas.height / 2,
//  5,
//  'red',
//  {
//    x: 1,
//    y: 1
//  }
//)
