
//% color="#AA278D"
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
pins.setEvents(DigitalPin.P0, PinEventType.Pulse)
let lTicks: number = 0
let rTicks: number = 0
let lTurns: number = 0.0
let rTurns: number = 0.0
let lenc: DigitalPin
let renc: DigitalPin
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
    P0 = DigitalPin.P0,
    //% block=P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% blcok="P14"
    P14 = DigitalPin.P14
}

enum MotorPower {
    //%block="ON"
    On = 28673,
    //%block="OFF"
    Off = 28672
}

pins.onPulsed(lenc, PulseValue.High, function () {
    lTicks += 1
})

pins.onPulsed(renc, PulseValue.High, function () {
    rTicks += 1
})


namespace encMotor {

    //%
    export class Robot { }
    let _ratio: number
    let _lenc: DigitalPin
    let _renc: DigitalPin
    /**
     * Creates a robot and automtically set it to a variable
     * @param ratio gives the motor to wheel turn ratio eg:48
     */
    //% block="create robot with %ratio to 1 gearing"
    //% blockSetVariable=robot
    export function createRobot(ratio: number): Robot {
        _ratio = ratio;
        _lenc = DigitalPin.P0;
        _renc = DigitalPin.P1
        return undefined;
    }


    //% blockID="encodedMotor" block="move %robot Direction $dir for $rt Rotations"
    export function drive(dir: motorDir, rt: number) {
        switch (dir) {
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

    function forward(sp: number, rt: number) {
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function reverse(sp: number, rt: number) {
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function spin(sp: number, rt: number) {
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function pwr(dir: number, speed: number): number {
        let outPwr: number = 0
        let pwr = 0
        speed = Math.abs(speed)
        if (speed > 100) {
            speed = 100
        }

        if (dir == motorDir.fwd) {
            outPwr = pins.map(speed, 0, 100, 0, 127)
            outPwr = 128 + pwr
        }
        else {
            outPwr = pins.map(speed, 0, 100, 127, 0)
        }

        return outPwr
    }
} 