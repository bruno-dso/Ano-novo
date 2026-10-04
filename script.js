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

const VAPID_PUBLIC_KEY = "BNsF6UdLxMSDDlWzvuYhsp7Xm083i6Y5RrzXnhfuzyWl4UojivS8hvf5gafbo_1KJk2ylJCRqEBHhGWihlGOHy4";

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

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = atob(base64);

    return Uint8Array.from(
        [...rawData].map(char => char.charCodeAt(0))
    );
}

document
    .getElementById("ativarNotificacoes")
    .addEventListener("click", async () => {

        try {

            const permission =
                await Notification.requestPermission();

            if (permission !== "granted") {
                alert("As notificações foram recusadas.");
                return;
            }

            const registration =
                await navigator.serviceWorker.ready;

            let subscription =
                await registration.pushManager.getSubscription();

            if (!subscription) {

                subscription =
                    await registration.pushManager.subscribe({

                        userVisibleOnly: true,

                        applicationServerKey:
                            urlBase64ToUint8Array(
                                VAPID_PUBLIC_KEY
                            )
                    });
            }

            console.log(
                "Push Subscription:",
                subscription
            );

            const resposta = await fetch(
                "/api/subscribe",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        subscription
                    )
                }
            );

            if (resposta.ok) {

                alert(
                    "🔔 Notificações ativadas!"
                );

            } else {

                alert(
                    "Erro ao registrar notificações."
                );
            }

        } catch (erro) {

            console.error(
                "Erro Push:",
                erro
            );

        }

    });