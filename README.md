# CHRONOTHERMOSTAT

**CHRONOTHERMOSTAT** è un'applicativo basato su IoT che permette di regolare comodamente la temperatura di un appartamento.

## Architettura Software

Di seguito è possibile trovare l'architettura software utilizzata. Questa sezione è divisa in due, la prima rigurda l'architettura locale che fa riferimento agli applicativi direttamente installati sul Raspberry, la seconda mostra invece come l'applicativo interagisce con l'API e l'MQTT broker forniti.

### Architettura locale

![a test image](arch-locale.png)

Procedendo da sinistra troviamo sensori ed attuatori. Lo schema in questo caso risulta semplificato in quanto ogni stanza prevede un sensore e due relé, il primo collegato ad un ESP8266 NodeMCU gli altri ad un ESP8266. Tutti e tre i dispositivi comunicano con il raspberry tramite MQTT, di seguito uno schema dei messaggi inviati/ricevuti dai dispositivi:

| device | sub topic | pub topic |
| :----: | :-------: | :-------: |
| sensor |   NONE    |  presence, readings |
| heat actuator | command-ha:MAC_ADDRESS | | presence |
| cool actuator | command-ha:MAC_ADDRESS | | presence |

- **presence**: permette di comunicare la presenza del dispositivo, questo serve in fase di settings
- **command-ha/ca:MAC_ADDRESS**: questo topic è univoco per ogni attuatore, questo gli permette di ricevere i messaggi di on/off

I messaggi MQTT sul raspberry vengono gestiti da un apposito broker: [Eclipse Mosquitto](https://mosquitto.org/), questo ci permette di smistare i messaggi verso gli applicativi che ne richiedono notifica. Andando avanti troviamo il cuore dell'applicazione, esso è costituito da un applicativo che fa da server, scritto con [Node express](https://expressjs.com/it/). Nello schema architetturale viene descritto come bridge HTML/MQTT in quanto esso si prende carico di trasformare richieste http in messaggi mqtt, questo perché l'interfaccia fornita all'utente è un'interfaccia web ed il protocollo http risultava più adatto per l'interazione tra le due parti. Oltre a far comunicare le due parti esso si prende carico di rendere persistente l'informazione necessaria all'applicazione. I file JSON rappresentano una sorta di cache, nello specifico:

- **apartment.json:** memorizza la configurazione dell'appartamento (stanze + dispositivi annessi)
- **sens:** rappresenta la lista dei sensori rilevati e non utilizzati per alcuna stanza
- **acts:** stessa cosa dei sensori, ma la lista fa riferimento agli attuatori
- **last-readings:** rappresenta una lista contenente le ultime letture effettuate da ogni sensore

Un ulteriore livello di persistenza è dato da un DB SQL situato in remoto, questo ha l'unico scopo di memorizzare tutte le letture effettuate da sensore al fine di poter utilizzare questa informazione per fornire statistiche sulla temperatura ed umidità relative ad ogni stanza nell'arco di 24h.
Infine troviamo la web interface descritta da un'applicazione [Angular](https://angular.io/).
  

### Architettura Rasp + API + MQTT

![a test image](arch-remote.png)

Il bridge HTTP/MQTT ha anche, come detto in precedenza, il ruolo di interfacciarsi con due componenti remote fornite da specifica:

- una REST API risiedente su Amazon e2c
- un MQTT broker anch'esso relativo ad Amazon

le specifiche relative a queste due componenti si possono trovare su: [github repository](https://github.com/german-sv/comsys19) 
