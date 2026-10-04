const TOPICO_ACIONADA =
    "campainha/esp32/a8f72c/acionada";

const TOPICO_RESPOSTA =
    "campainha/esp32/a8f72c/resposta";

const clientId =
    "Pagina-" +
    Math.random()
        .toString(16)
        .substring(2, 10);

const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt",
    {
        clientId: clientId,
        clean: true,
        reconnectPeriod: 1000
    }
);

const mensagem =
    document.getElementById("mensagem");

const conexao =
    document.getElementById("conexao");


client.on("connect", () => {

    console.log("MQTT conectado!");

    conexao.textContent =
        "🟢 Conectado";

    client.subscribe(
        TOPICO_ACIONADA,
        (erro) => {

            if (erro) {
                console.log(
                    "Erro ao se inscrever"
                );
            }

        }
    );

});


client.on("message", (topic, message) => {

    const texto =
        message.toString();

    console.log(
        "Mensagem:",
        texto
    );

    if (
        topic === TOPICO_ACIONADA &&
        texto === "CAMPAINHA_ACIONADA"
    ) {

        mensagem.textContent =
            "🔔 Alguém está na porta!";

    }

});


client.on("error", (erro) => {

    console.log(
        "Erro MQTT:",
        erro
    );

    conexao.textContent =
        "🔴 Erro na conexão";

});


function responder(resposta) {

    client.publish(
        TOPICO_RESPOSTA,
        resposta
    );

    mensagem.textContent =
        "Resposta enviada: " +
        resposta;
}

