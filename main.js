const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Variables
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

// Event Listeners 키를 누른 상태가 참, 키를 뗀 상태가 거짓
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

// class는 object 같은 것
class Player {
  constructor (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    // width
    this.h = h;
    // height
    this.c = c;
    // color
    this.dy = 0;
    // direction y force
    this.jumpForce = 20;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

// 게임키
  Animate () {
    // Jump
    // 이거 방향키로 고쳐주기
    if (keys['Space'] || keys['ArrowUp']) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

// 눕기인데... 원래의 높이에서 2를 나눠버리는듯..
    if (keys['ShiftLeft'] || keys['ArrowDown']) {
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    // Gravity  땅에 떨어진 뒤에 바닥에 붙어있게 하는거 같음
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }
    this.Draw();
  }

// 키를 누르고 있는 정도에 따라 점프능력 향상시킴
  Jump () {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }

// 플레이어 개체가 그려진다 draw method
  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(img1, this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

var img1 = new Image( );
img1.src = '2-1.png';


//장애물 초기속도 변수지정
var initialSpeed = 10;

class Obstacle {
  constructor (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.dx = -gameSpeed;
  }

  Update () {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(img2, this.x, this.y)
    ctx.closePath();
  }
}

var img2 = new Image( );
img2.src = '3.png';


// 문자로 나오는 부분 t는 text
class Text {
  constructor (t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

// 폰트 수정
  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px Black Han Sans";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}


// Game Functions
// 장애물 소환 장애물 여기서 추가. 지금 얘의 경우 내 캐릭터가 50*50이라, 높이가 20에서 70으로 지정된
function SpawnObstacle () {
  let size = RandomIntInRange(45, 55);
  // 하나는 땅에 붙어오는거 하나는 하늘로 날아오는거
  let type = RandomIntInRange(0, 1);

  console.log(size,type);
 
  // 캔버스 폭과 사이즈 핏을 해서.. left, top, width, height...
  // let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');
   

// 장애물의 높이가 플레이어 높이-10이라, 약간 높이가거나 바닥에 붙어가서, 플레이어와 충돌하게 한다.
  if (type == 1) {
    var obstacle = new Obstacle(canvas.width + size, 360, size, size, '#2484E4');
  }else{
    var obstacle = new Obstacle(canvas.width + size, 550, size, size, '#2484E4');
  }
  obstacles.push(obstacle);
}



function RandomIntInRange (min, max) {
   min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function Start () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;



// 폰트 수정
  ctx.font = "24px BlackHanSans";
 
  gameSpeed = initialSpeed;
  gravity = 2;

  score = 0;
  highscore = 0;
 
// 만약 로컬 스토리지에 하이스코어가 저장되어있다면 그것을 가져온다.
  if (sessionStorage.getItem('highscore')) {
    highscore = sessionStorage.getItem('highscore');
  }


// 사용자가 움직이는 네모 left, top, width, height, color 순
  player = new Player(80, 60, 250, 320, '#FF5858');

// 점수 나오는 부분, 원래 쓰는 폰트로 바꿔야함 score라는 말 뒤에 score값, left, top, 좌측정렬, 색상, 사이즈
  scoreText = new Text("Score: " + score, 25, 100, "left", "#f4cd20", "30");

//Highscore라는 말 뒤에 highscore값, left? right?, top, 우측정렬, 색상, 사이즈
  highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 100, "right", "#f4cd20", "30");
  requestAnimationFrame(Update);
}

// 장애물 스폰 시간 설정
let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update () {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
// 캔버스가 새로 시작할 때... 우리가 똑같은걸 또 그릴 필요가 없어서 이거 안쓰면 네모가 계속 길어지는 불상사가 생김



  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;
   
    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // Spawn Enemies
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

// 장애물과 붙었다면 이것은 접촉이다
    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

// 장애물과 접촉했다면 스코어는 0이 되고 스폰 시간과 게임 스피드가 초기로 돌아간다. 그리고 하이스코어는 로컬 스토리지에 저장된 값
    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y < o.y + o.h &&
      player.y + player.h > o.y
    ) {
      alert("어이 거기 학생! 아직 하교 시간 아니야!");  
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = initialSpeed;
      window.localStorage.setItem('highscore', highscore);
    }


    o.Update();
  }

  player.Animate();

  score++;
  scoreText.t = "집까지 간 거리: " + score + " km";
  scoreText.Draw();


// 스코어가 하이 스코어보다 높다면 하이스코어는 스코어값과 같다.
  if (score > highscore) {
    highscore = score;
    highscoreText.t = "제일 가까이 간 거리: " + highscore + " km";
  }
 
  highscoreText.Draw();

// 점점 빨라지게 하는 코드
  gameSpeed += 0.015;
}

Start();