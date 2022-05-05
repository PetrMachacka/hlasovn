pins.touchSetMode(TouchTarget.P0, TouchTargetMode.Capacitive)
radio.setGroup(69)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
let start = 0
let cislo = 1
let data_list = [[0], [0]]
let myserial = []
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
//  Klient
//  Moving
//  Send number
input.onPinPressed(TouchPin.P1, function on_pin_pressed_p1() {
    if (role == "klient") {
        radio.sendValue("key", cislo)
    }
    
})
function on_received_value_klient(name: any, value: any) {
    if (role == "klient") {
        if (name == "acr") {
            music.playTone(Note.C, 300)
        }
        
    }
    
    if (name == "vote") {
        if (value == 1) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
        
    }
    
}

radio.onReceivedValue(on_received_value)
//  Server
function on_received_value(name: string, value: number) {
    let serial_number = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    
    if (role == "server") {
        if (start == 1 && name == "key") {
            music.playTone(Note.C, 200)
            console.log(String.fromCharCode(value + 64))
            radio.sendValue("acr", serial_number)
        }
        
    }
    
    if (role == "klient") {
        if (name == "acr" && value == control.deviceSerialNumber()) {
            music.playTone(Note.C, 300)
        }
        
        if (name == "vote") {
            if (value == 1) {
                basic.showIcon(IconNames.Yes)
            } else {
                basic.showIcon(IconNames.No)
            }
            
        }
        
    }
    
}

radio.onReceivedValue(on_received_value)
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    if (role == "klient") {
        
        cislo = Math.constrain(cislo, 2, 5)
        cislo -= 1
        basic.showString(String.fromCharCode(cislo + 64))
    } else {
        
        if (start == 1) {
            start = 0
        } else {
            start = 1
        }
        
        console.log(start)
        radio.sendValue("vote", start)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    if (role == "klient") {
        
        cislo = Math.constrain(cislo, 2, 5)
        cislo += 1
        basic.showString(String.fromCharCode(cislo + 64))
    }
    
})
