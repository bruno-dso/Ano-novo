const { Redis } = require("@upstash/redis");
const webpush = require("web-push");

const redis = Redis.fromEnv();

webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    try {

        const subscriptionJSON =
            await redis.get("push:subscription");

        if (!subscriptionJSON) {
            return res.status(404).json({
                error: "Nenhuma inscrição encontrada"
            });
        }

        const subscription =
            typeof subscriptionJSON === "string"
                ? JSON.parse(subscriptionJSON)
                : subscriptionJSON;

        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: "🔔 Campainha",
                body: "Alguém está na porta!"
            })
        );

        return res.status(200).json({
            success: true,
            message: "Notificação enviada!"
        });

    } catch (error) {

        console.error(
            "Erro ao enviar Push:",
            error
        );

        return res.status(500).json({
            error: "Erro ao enviar notificação"
        });
    }
};