const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')




canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length ; i+= 40){
    collisionsMap.push(collisions.slice(i, i + 40))
    
}

const npcMap = []
for (let i = 0; i < npc_zone.length ; i+= 40){
    npcMap.push(npc_zone.slice(i, i + 40))
}



const boundaries = []
const offset = {
    x: -1220,
    y: -1600
}
collisionsMap.forEach((row, i) =>{
    row.forEach((symbol, j) => {
        if (symbol == 594){
        boundaries.push(
            new Boundary({
                position:{
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )}
    })
})

const npcZones = []
npcMap.forEach((row, i) =>{
    row.forEach((symbol, j) => {
        if (symbol == 630){
        npcZones.push(
            new Boundary({
                position:{
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )}
    })
})

console.log(npcZones)


const image = new Image()
image.src = './game assets/world pngs/level.png'

const foregroundImage = new Image()
foregroundImage.src = './game assets/world pngs/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './game assets/player/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './game assets/player/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './game assets/player/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './game assets/player/playerRight.png'



// 
//             
const player = new Sprite({
    position: {
        x: canvas.width/2 - (192/4)/2,
        y: canvas.height/2 -(68/2),
    },
    image: playerDownImage,
    frames: {
        max:4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },

    f: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...npcZones]
//animation loop

function rectangularCollision({rectangle1, rectangle2}){
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x+rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y +rectangle1.height >= rectangle2.position.y)
}


const npcSequence = {
    initiated: false
}
document.getElementById('needhide').style.display = "none";
function animate(){
    const animationID = window.requestAnimationFrame(animate)
    //console.log(animationID)
    background.draw()

    
    boundaries.forEach(boundary => {
        boundary.draw()
        
    } )

    npcZones.forEach(zone => {
        zone.draw()
    } )
    player.draw()
    foreground.draw()

    
    let moving = true
    player.moving = false
    //console.log(animationID)
    if (npcSequence.initiated) return

    if (keys.f.pressed){
        for(let i =0; i<npcZones.length;i++){
            const npcZone = npcZones[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: npcZone
            })){
                keys.f.pressed= false
                console.log('npcZone')
                npcSequence.initiated = true
                window.cancelAnimationFrame(animationID)
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    yoyo: true,
                    duration: 1,
                    onComplete(){
                        document.getElementById('needhide').style.display = "flex";
                        animateNpcSequence()
                        gsap.to('#overlappingDiv',{
                            opacity: 0,
                            duration: 1
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
            for(let i =0; i<boundaries.length;i++){
                const boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x,
                        y:boundary.position.y + 3
                    }}
                })){
                    console.log('colliding')
                    moving = false
                    break
                }
            }

            

            if (moving){
            movables.forEach(movable => {
                movable.position.y+=3
            })
            }
        }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left
            for(let i =0; i<boundaries.length;i++){
                const boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x+3,
                        y:boundary.position.y
                    }}
                })){
                    console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving){
            movables.forEach(movable => {
                movable.position.x+=3
            })}
        }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
            for(let i =0; i<boundaries.length;i++){
                const boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x,
                        y:boundary.position.y - 3
                    }}
                })){
                    console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving){
            movables.forEach(movable => {
                movable.position.y-=3
            })}
        }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right
            for(let i =0; i<boundaries.length;i++){
                const boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x - 3,
                        y:boundary.position.y 
                    }}
                })){
                    console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving){
            movables.forEach(movable => {
                movable.position.x-=3
            })
        }
        }
}

animate()
//infinite loop


const npcBackgroundImage = new Image()
npcBackgroundImage.src = './game assets/world pngs/npcbackground.jpg'
const npcBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image: npcBackgroundImage
})

const npcMainImage = new Image()
npcMainImage.src = "./game assets/player/npc_main.png"
const npcImage = new Sprite({
    position:{
        x:250,
        y:25
    },
    image: npcMainImage
})


function animateNpcSequence(){
    const animationNPCID = window.requestAnimationFrame(animateNpcSequence)
    npcBackground.draw()
    npcImage.draw()
    window.cancelAnimationFrame(animationNPCID)
    //console.log('animating NPC')
}

//animateNpcSequence()
let lastKey = ''
window.addEventListener('keydown',(e)=>{
   
    switch (e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        
        case 'f':
            keys.f.pressed = true
            lastKey = 'f'
            break
    }
})

window.addEventListener('keyup',(e)=>{
   
    switch (e.key){
        case 'w':
            keys.w.pressed = false
            break
        
        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})












//Emotion swapper:


