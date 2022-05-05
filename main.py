pins.touch_set_mode(TouchTarget.P0, TouchTargetMode.CAPACITIVE)
radio.set_group(69)
radio.set_transmit_power(7)
radio.set_transmit_serial_number(True)
start = 0
cislo = 1
data_list = [[0],[0]]
myserial = 
role = "klient"
basic.show_string("K")
# Role changing
def on_logo_event_pressed2():
    global role
    if role == "klient": 
        role = "server"
        basic.show_string("S")
    else: 
        role = "klient"
        basic.show_string("K")
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_event_pressed2)
# Klient

# Moving
def on_button_pressed_a():
    if role == "klient":
        global cislo
        cislo = Math.constrain(cislo, 2, 5)
        cislo -= 1
        basic.show_string(String.from_char_code(cislo + 64))
    else:
        global start
        if start == 1:start = 0
        else: start = 1
        print(start)
        radio.send_value("vote", start)
def on_button_pressed_b():
    if role == "klient":
        global cislo
        cislo = Math.constrain(cislo, 2, 5)
        cislo += 1
        basic.show_string(String.from_char_code(cislo + 64))
# Send number
def on_pin_pressed_p1():
    if role == "klient":
        radio.send_value("key", cislo)
input.on_pin_pressed(TouchPin.P1, on_pin_pressed_p1)
def on_received_value_klient(name, value):
    if role == "klient":
        if name == "acr":
            music.play_tone(Note.C, 300)
    if name == "vote":
        if value == 1:
            basic.show_icon(IconNames.YES)
        else:
            basic.show_icon(IconNames.NO)
radio.on_received_value(on_received_value)
# Server
def on_received_value(name, value):
    serial_number = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    global start
    if role == "server":
        if start == 1 and name == "key":
            music.play_tone(Note.C, 200)
            print(String.from_char_code(value + 64 ))
            radio.send_value("acr", serial_number)
    if role == "klient":
        if name == "acr" and value == control.device_serial_number():
                music.play_tone(Note.C, 300)
        if name == "vote":
            if value == 1:
                basic.show_icon(IconNames.YES)
            else:
                basic.show_icon(IconNames.NO)
radio.on_received_value(on_received_value)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)