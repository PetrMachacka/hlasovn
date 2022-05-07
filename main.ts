pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive)
radio.setGroup(69)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
let start = 0
let cislo = 1
let data_list_serial = [0]
let data_list_vote = ["nothing"]
let control_list = [0]
let role = "klient"
basic.showString("K")
//  Role changing
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_event_pressed2() {
    
    if (role == "klient") {
        role = "server"
        basic.showString("S")
    } else {
        role = "klient"
        basic.showString("K")
    }
    
})
//  Starting
input.onLogoEvent(TouchButtonEvent.LongPressed, function vysledky() {
    let counter: number;
    
    if (start == 0) {
        counter = 0
        for (let i of _py.slice(data_list_serial, null, null, -1)) {
            if (control_list.indexOf(i) < 0) {
                control_list.push(i)
                console.log(i + " " + data_list_vote[data_list_vote.length - (counter + 1)])
            }
            
            counter += 1
        }
    }
    
})
//  Send number
input.onPinPressed(TouchPin.P1, function on_pin_pressed_p1() {
    if (role == "klient") {
        radio.sendValue("vote", cislo)
    }
    
})
//  Receive
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    let serial_number = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (role == "server") {
        if (start == 1 && name == "vote") {
            music.playTone(Note.C, 200)
            radio.sendValue("ack", serial_number)
            data_list_serial.push(serial_number)
            data_list_vote.push(String.fromCharCode(value + 64))
        }
        
    }
    
    if (role == "klient") {
        if (name == "ack" && value == control.deviceSerialNumber()) {
            music.playTone(Note.C, 300)
        }
        
        if (name == "enabled") {
            if (value == 1) {
                basic.showIcon(IconNames.Yes)
            } else {
                basic.showIcon(IconNames.No)
            }
            
        }
        
    }
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    //  Start
    if (role == "klient") {
        
        cislo = Math.constrain(cislo, 2, 26)
        cislo -= 1
        basic.showString(String.fromCharCode(cislo + 64))
    } else {
        // End
        
        if (start == 1) {
            start = 0
        } else {
            start = 1
        }
        
        radio.sendValue("enabled", start)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    if (role == "klient") {
        
        cislo = Math.constrain(cislo, 1, 25)
        cislo += 1
        basic.showString(String.fromCharCode(cislo + 64))
    } else {
        //  Nulovani
        
        data_list_serial = [0]
        data_list_vote = ["nothing"]
        control_list = [0]
    }
    
})
