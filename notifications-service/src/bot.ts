import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket
} from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"
import { Boom } from "@hapi/boom"

let sockInstance: WASocket | null = null

export const getSock = () => {
  console.log("📥 getSock llamado. sockInstance =", sockInstance)
  return sockInstance
}

export const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sockInstance = sock 

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("📲 Escaneá este QR para vincular:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp")
      setTimeout(async () => {
        const number = "5493765223959@s.whatsapp.net"
        await sock.sendMessage(number, {
          text: "🚀 Hola Carlos, el bot está funcionando correctamente."
        })
        console.log("✅ Mensaje de prueba enviado")
      }, 1000)
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
      sockInstance = null
      if (reason !== DisconnectReason.loggedOut) {
        console.log("⚠️ Conexión cerrada. Intentando reconectar...")
        await startBot()
      } else {
        console.log("❌ Bot deslogueado. Necesita escanear el QR de nuevo.")
      }
    }
  })
}
