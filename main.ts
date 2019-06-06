
//% color="#AA278D"

let _lTicks: number = 0
let _rTicks: number = 0
let _lTurns: number = 0.0
let _rTurns: number = 0.0
let _lenc: DigitalPin
let _renc: DigitalPin
let _partialTurn: number = 0.0

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
    sp,
    //% block="Stop"
    st
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

control.onEvent(EventBusSource.MICROBIT_ID_IO_P0, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
    _lTicks += 1
    if (_lTicks % _partialTurn == 0) {
        _lTicks = 0;
        _lTurns += .0625;
    }
})

control.onEvent(EventBusSource.MICROBIT_ID_IO_P1, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
    _rTicks += 1
    if (_rTicks % _partialTurn == 0) {
        _rTicks = 0;
        _rTurns += .0625;
    }
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
        _renc = DigitalPin.P1;
        pins.setPull(_lenc, PinPullMode.PullUp)
        pins.setEvents(_lenc, PinEventType.Edge)
        pins.setPull(_renc, PinPullMode.PullUp)
        pins.setEvents(_renc, PinEventType.Edge)
        _partialTurn = (_ratio * 8) / 16
        return undefined;

    }

    /**
     * Moves a robot based on wheel rotations
     * @param rt indicates number of rotations eg:4
     */
    //% block="move %robot=variables_get(robot) %dir for %rt Rotations"
    export function drive(robot: Robot, dir: motorDir, rt: number) {
        if (dir == motorDir.fwd) {
            forward(50, rt);
        }
        else { stop(); }


    }

    function forward(sp: number, rt: number) {
        _lTurns = 0;
        _rTurns = 0;
        _lTicks = 0;
        _rTicks = 0;
        pins.i2cWriteNumber(89, 28673, NumberFormat.Int16BE) //enable motors
        pins.i2cWriteNumber(89, 8448 + pwr(0, 50), NumberFormat.Int16BE) //start left motor
        pins.i2cWriteNumber(89, 8192 + pwr(0, 50), NumberFormat.Int16BE) //start right motor
        while (_lTurns < rt) {
            basic.pause(100)
        };
        basic.showNumber(_lTurns)
        pins.i2cWriteNumber(89, 28672, NumberFormat.Int16BE)//stop motors

    }

    function reverse(sp: number, rt: number) {
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function spin(sp: number, rt: number) {
        pins.i2cWriteNumber(89, MotorPower.On, NumberFormat.Int16BE) //enable motors
    }

    function stop() {
        pins.i2cWriteNumber(89, MotorPower.Off, NumberFormat.Int16BE)//stop motors
    }

    function pwr(dir: number, speed: number): number {
        let outPwr: number = 0

        speed = Math.abs(speed)
        if (speed > 100) {
            speed = 100
        }

        if (dir == motorDir.fwd) {
            outPwr = pins.map(speed, 0, 100, 0, 127)
            outPwr = 128 + outPwr
        }
        else {
            outPwr = pins.map(speed, 0, 100, 127, 0)
        }

        return outPwr
    }
} 