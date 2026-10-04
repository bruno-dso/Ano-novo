const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();

module.exports = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    try {

        const subscription = req.body;

        if (
            !subscription ||
            !subscription.endpoint ||
            !subscription.keys
        ) {
            return res.status(400).json({
                error: "Subscription inválida"
            });
        }

        await redis.set(
            "push:subscription",
            JSON.stringify(subscription)
        );

        console.log("Push Subscription salva!");

        return res.status(200).json({
            success: true,
            message: "Subscription salva com sucesso"
        });

    } catch (error) {

        console.error(
            "Erro ao salvar subscription:",
            error
        );

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};