
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
    Left = 8448,
    //% block="right"
    Right = 8192,
    //% block="both"
    Both = 5555
}

enum motorDir {
    //% block="Forward"
    fwd,
    //% block="Backward"
    bak
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

Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore

@shawt
38
2 6 sparkfun/ pxt - gamer - bit
Code  Issues 0  Pull requests 2  Projects 0  Wiki  Security  Insights
pxt - gamer - bit / gamerbit.ts
@marshalltaylorSFE marshalltaylorSFE Manually copied from old repo to remove fork.Old repo still exists a…
eda5487 on Jun 14, 2017
75 lines (70 sloc)  2 KB
    
Jump to definition is available!Beta
Navigate your code with ease.In select public repositories, you can now click on function and method calls to jump to their definitions in the same repository.Learn more

Jump to definition is still being calculated for this commit.Check back in a bit.Beta

Learn more or give us feedback
/**
 * The pins used by SparkFun gamer:bit
 */
//%
enum GamerBitPin {
    //% block="P0 (D-PAD up)"
    P0 = <number>DAL.MICROBIT_ID_IO_P0,
    //% block="P1 (D-PAD left)"
    P1 = DAL.MICROBIT_ID_IO_P1,
    //% block="P2 (D-PAD right)"
    P2 = DAL.MICROBIT_ID_IO_P2,
    //% block="P8 (D-PAD down)"
    P8 = DAL.MICROBIT_ID_IO_P8,
    //% block="P12 (Y button)"
    P12 = DAL.MICROBIT_ID_IO_P12,
    //% block="P16 (X button)"
    P16 = DAL.MICROBIT_ID_IO_P16,
    //% block="P5 (A button)"
    P5 = DAL.MICROBIT_ID_IO_P5,
    //% block="P11 (B button)"
    P11 = DAL.MICROBIT_ID_IO_P11,
}

/**
 * The event raised by the SparkFun gamer:bit pins
 */
//%
enum GamerBitEvent {
    //% block="down"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="up"
    Up = DAL.MICROBIT_BUTTON_EVT_UP,
    //% block="click"
    Click = DAL.MICROBIT_BUTTON_EVT_CLICK,
}

/**
 * Functions to operate the SparkFun gamer:bit
 */
//% color=#f44242 icon="\uf11b"
namespace gamerbit {
	/**
	 * 
	 */
    //% shim=gamerbit::init
    function init(): void {
        return;
    }

	/**
	 * Determines if a button is pressed
	 * @param button the pin that acts as a button
	 */
    //% weight=89
    //% blockId=gamerbit_ispressed block="gamer:bit %button|is pressed"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    export function isPressed(button: GamerBitPin): boolean {
        const pin = <DigitalPin><number>button;
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(<DigitalPin><number>button) == 0;
    }

	/**
	 * Registers code to run when a gamer:bit event is detected.
	 */
    //% weight=90
    //% blockId=gamerbit_onevent block="gamer:bit on %button|%event"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onEvent(button: GamerBitPin, event: GamerBitEvent, handler: Action) {
        init();
        control.onEvent(<number>button, <number>event, handler); // register handler
    }
}



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
    //% block="move %robot=variables_get(robot) %motor %dir for %rt Rotations"
    export function drive(robot: Robot, motor: motorChoice, dir: motorDir, rt: number) {
        _lTurns = 0;
        _rTurns = 0;
        _lTicks = 0;
        _rTicks = 0;
        if (motor == motorChoice.Both) {
            motorGo(50, 8448, dir) //start left motor
            motorGo(50, 8192, dir) //start right motor
        }
        else { motorGo(50, motor, dir) }
        while (_lTurns < rt && _rTurns < rt) {
            basic.pause(100)
        }
        stop()

    }

    //% block="drive %motorChoice motor(s) %motorDir for %tm secs."
    //% tm.defl=5
    export function driveWtime(motor: motorChoice, dir: motorDir, tm: number) {
        _lTurns = 0;
        _rTurns = 0;
        _lTicks = 0;
        _rTicks = 0;
        if (motor == motorChoice.Both) {
            motorGo(50, 8448, dir) //start left motor
            motorGo(50, 8192, dir) //start right motor
        }
        else { motorGo(50, motor, dir) }
        basic.pause(tm * 1000)
        stop()
        _lTurns = 0;
        _rTurns = 0;
        _lTicks = 0;
        _rTicks = 0;
    }

    //% block="stop motors"
    export function stop() {
        pins.i2cWriteNumber(89, MotorPower.Off, NumberFormat.Int16BE)//stop motors
        motorGo(0, 8448, 0) //set left speed to 0
        motorGo(0, 8192, 0) //set right speed to 0
    }

    function motorGo(sp: number, mt: number, dir: number) {
        pins.i2cWriteNumber(89, 28673, NumberFormat.Int16BE) //enable motors
        pins.i2cWriteNumber(89, (mt + pwr(dir, sp)), NumberFormat.Int16BE) //start designated motor
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