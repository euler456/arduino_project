#include <cstddef>

const byte LEFT1 = 8; //IN1
const byte LEFT2 = 9; //IN2
const byte LEFT_PWM = 10;
//右馬達控制設定
const byte RIGHT1 = 7; //IN3
const byte RIGHT2 = 6; //IN4
const byte RIGHT_PWM = 5;
//設定PWM輸出值(代表的是車子的速度)
byte motorspeed = 130;

void forward(){
  digitalWrite(LEFT1, HIGH);
  digitalWrite(LEFT2, LOW);
  analogWrite(LEFT_PWM, motorspeed);
  //右輪·因在小車上馬達安装方向左右兩個是相
  digitalWrite(RIGHT1, LOW);
  digitalWrite (RIGHT2, HIGH);
  analogWrite(RIGHT_PWM, motorspeed);
}

void backward(){ //後退
  digitalWrite(LEFT1, LOW);
  digitalWrite (LEFT2, HIGH);
  analogWrite(LEFT_PWM, motorspeed);
  digitalWrite(RIGHT1, HIGH);
  digitalWrite(RIGHT2, LOW);
  analogWrite(RIGHT_PWM, motorspeed);
}

void turnLeft(){//左轉
  //左輪不動,右輪動(速度為0)
  analogWrite(LEFT_PWM, 0);
  digitalWrite(RIGHT1, LOW);
  digitalWrite (RIGHT2, HIGH);
  analogWrite(RIGHT_PWM, motorspeed);
}

void turnRight(){//右轉
  //右輪不動,左輪動(速度為0)
  digitalWrite(LEFT1, HIGH);
  digitalWrite(LEFT2, LOW);
  analogWrite(LEFT_PWM, motorspeed);
  analogWrite(RIGHT_PWM, 0);
}

void stopMotor() {
  analogWrite(LEFT_PWM, 0);
  analogWrite(RIGHT_PWM, 0);
}

void setup(){ 
  //設定每一個PIN的模式
  pinMode(LEFT1, OUTPUT);
  pinMode(LEFT2, OUTPUT);
  pinMode(LEFT_PWM, OUTPUT);
  pinMode(RIGHT1, OUTPUT);
  pinMode(RIGHT2, OUTPUT);
  pinMode(RIGHT_PWM, OUTPUT);
}

void loop() {
  forward();
  delay(2000); //前進2秒
  backward();
  delay(2000); //後退2秒
  turnRight();
  delay(2000); //右轉2秒
  turnLeft();
  delay(2000); //左轉2秒
  stopMotor();
  delay(2000); //停止2秒
}