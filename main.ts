
//% color="#AA278D"
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
pins.setEvents(DigitalPin.P0, PinEventType.Pulse)
let ticks: number = 0
enum motorChoice {
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

enum motorDir {
    //% block="Forward"
    fwd,
    //% block="Backward"
    bak,
    //% block="Spin"
    sp
}

enum encPin {
    //% block="P0"
    p0,
    //% block=P1"
    p1,
    //% block="P2"
    p2,
    //% block="P8"
    p8,
    //% block="P12"
    p12,
    //% blcok="P14"
    p14
}

enum MotorPower {
    //%block="ON"
    On = 28673,
    //%block="OFF"
    Off = 28672
}


control.onEvent(EventBusSource.MICROBIT_ID_IO_P0, EventBusValue.MICROBIT_EVT_ANY, function () {
    ticks += 1
})
namespace encMotor {


    //% blockID="encodedMotor" block="Encoded Motor|Enc:Wheel Ratio $ratio Lenc $le Renc $re Motor $mc Direction $dir Speed $sp Rotations $rt"
    //% ratio.defl=48
    //% sp.defl=50
    export function drive(ratio: number, le: encPin, re: encPin, mc: motorChoice, dir: motorDir, sp: number, rt: number) {
        if(mc==2){
            switch(dir){
                case 0:
                    forward(sp, rt);
                    break;
                case 1:
                    reverse(sp, rt);
                    break;
                case 2:
                    spin(sp, rt);
                    break;
            }
        }
    }

    function forward(sp: number, rt: number){
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function reverse(sp: number, rt: number){
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function spin(sp: number, rt: number){
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }


} 