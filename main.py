pins.touch_set_mode(TouchTarget.P1, TouchTargetMode.CAPACITIVE)
radio.set_group(69)
radio.set_transmit_power(7)
radio.set_transmit_serial_number(True)
start = 0
cislo = 1
data_list_serial = [0]
data_list_vote = ["nothing"]
control_list = [0]
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
# Starting
def on_button_pressed_a():
    # Start
    if role == "klient":
        global cislo
        cislo = Math.constrain(cislo, 2, 26)
        cislo -= 1
        basic.show_string(String.from_char_code(cislo + 64))
    #End
    else:
        global start, control_list, data_list_serial, data_list_vote
        if start == 1:
            start = 0
            counter = 0
            
            for i in data_list_serial[::-1]:
                if i not in control_list:
                    control_list.append(i)
                    print(i + " " + data_list_vote[len(data_list_vote)-(counter+1)])
                counter += 1
            data_list_serial = [0]
            data_list_vote = ["nothing"]
            control_list = [0]
        else: start = 1
        print(start)
        radio.send_value("enabled", start)
def on_button_pressed_b():
    if role == "klient":
        global cislo
        cislo = Math.constrain(cislo, 1, 25)
        cislo += 1
        basic.show_string(String.from_char_code(cislo + 64))
# Send number
def on_pin_pressed_p1():
    if role == "klient":
        radio.send_value("vote", cislo)
input.on_pin_pressed(TouchPin.P1, on_pin_pressed_p1)
# Receive
def on_received_value(name, value):
    global data_list_vote
    serial_number = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    if role == "server":
        if start == 1 and name == "vote":
            music.play_tone(Note.C, 200)
            radio.send_value("ack", serial_number)
            data_list_serial.append(serial_number)
            data_list_vote.append(String.from_char_code(value + 64))
            print(data_list_serial)
            print(data_list_vote)
    if role == "klient":
        if name == "ack" and value == control.device_serial_number():
                music.play_tone(Note.C, 300)
        if name == "enabled":
            if value == 1:
                basic.show_icon(IconNames.YES)
            else:
                basic.show_icon(IconNames.NO)
radio.on_received_value(on_received_value)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)