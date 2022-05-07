
> Otevřít tuto stránku v aplikaci [https://petrmachacka.github.io/hlasovn/](https://petrmachacka.github.io/hlasovn/)
## Upravit tento projekt ![Odznak stavu sestavení](https://github.com/petrmachacka/hlasovn/workflows/MakeCode/badge.svg)

Slouží k úpravě tohoto úložiště v aplikaci MakeCode.

* otevřít [https://makecode.microbit.org/](https://makecode.microbit.org/)
* klikněte na možnost **Import** a poté na **Import adresy URL**
* vložte **https://github.com/petrmachacka/hlasovn** a klikněte na možnost import

## Ovládání
* přepínač serveru a klienta = krátké zmáčknutí loga
* hlasování vypnuto/zapnuto = button_A
* přepínání hlasu = button_A/button_B
* odeslání hlasu = pin_1
* vynulování hlasů = button_B
* zobrazit výsledky = logo_longpress

## Protokoly
* hlasování vypnuto/zapnuto = enabled, 0/1
* potvrzení hlasu = ack, seriové číslo
* poslání hlasu = vote, 65 > cislo < 25
* radio.set_group = 69