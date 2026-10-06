import mqtt from "mqtt";

let client = null;

// Menyimpan semua listener dari halaman yang sedang aktif
const listeners = new Set();

// ==================================================
// MQTT TOPIC
// ==================================================

const TOPIC_WATERLEVEL =
  "smart-irrigation/waterlevel";

const TOPIC_PUMPSTATUS =
  "smart-irrigation/pumpstatus";

const TOPIC_DEVICE =
  "smart-irrigation/device-status";

const TOPIC_MANUAL =
  "smart-irrigation/manualwatering";

const TOPIC_TIMER =
  "smart-irrigation/timer";


// ==================================================
// CONNECT MQTT
// ==================================================

export function connectMQTT(onMessage) {

  // Tambahkan listener halaman
  if (onMessage) {
    listeners.add(onMessage);
  }

  // Jika MQTT sudah terhubung
  // jangan membuat koneksi baru
  if (client && client.connected) {

    console.log(
      "♻️ MQTT sudah terhubung, menggunakan koneksi yang sama"
    );

    return client;

  }


  // Jika sedang proses koneksi
  if (client && client.connecting) {

    console.log(
      "⏳ MQTT sedang melakukan koneksi..."
    );

    return client;

  }


  // ==================================================
  // BUAT MQTT CLIENT
  // ==================================================

  client = mqtt.connect(

    process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "wss://fa88b001004142059363babeab2da204.s1.eu.hivemq.cloud:8884/mqtt",

    {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME || "esp32",

      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD || "Kancil_69",

      reconnectPeriod: 1000,

      connectTimeout: 10000,

      clean: true,
    }

  );


  // ==================================================
  // CONNECTED
  // ==================================================

  client.on("connect", () => {

    console.log(
      "✅ MQTT Connected"
    );


    // Subscribe semua topic
    client.subscribe(
      [
        TOPIC_WATERLEVEL,
        TOPIC_PUMPSTATUS,
        TOPIC_DEVICE,
      ],
      (err) => {

        if (err) {

          console.log(
            "❌ Gagal Subscribe MQTT:",
            err
          );

          return;

        }

        console.log(
          "📡 Subscribe WaterLevel"
        );

        console.log(
          "📡 Subscribe PumpStatus"
        );

        console.log(
          "📡 Subscribe Device Status"
        );

      }
    );

  });


  // ==================================================
  // MQTT MESSAGE
  // ==================================================

  client.on(
    "message",
    (topic, message) => {

      const value =
        message.toString();

      console.log(
        "📩 MQTT Message:",
        topic,
        value
      );


      let data = null;


      // ================================================
      // WATER LEVEL
      // ================================================

      if (
        topic === TOPIC_WATERLEVEL
      ) {

        data = {

          type:
            "waterlevel",

          value:
            Number(value),

        };

      }


      // ================================================
      // PUMP STATUS
      // ================================================

      else if (
        topic === TOPIC_PUMPSTATUS
      ) {

        data = {

          type:
            "pumpstatus",

          value:
            value,

        };

      }


      // ================================================
      // DEVICE STATUS
      // ================================================

      else if (
        topic === TOPIC_DEVICE
      ) {

        data = {

          type:
            "device",

          value:
            value,

        };

      }


      // ================================================
      // KIRIM KE SEMUA LISTENER
      // ================================================

      if (data) {

        listeners.forEach(
          (listener) => {

            try {

              listener(data);

            } catch (error) {

              console.error(
                "Error pada MQTT listener:",
                error
              );

            }

          }
        );

      }

    }
  );


  // ==================================================
  // MQTT ERROR
  // ==================================================

  client.on(
    "error",
    (err) => {

      console.log(
        "MQTT Error:",
        err
      );

    }
  );


  // ==================================================
  // MQTT CLOSE
  // ==================================================

  client.on(
    "close",
    () => {

      console.log(
        "🔌 MQTT Connection Closed"
      );

    }
  );


  // ==================================================
  // MQTT RECONNECT
  // ==================================================

  client.on(
    "reconnect",
    () => {

      console.log(
        "🔄 MQTT Reconnecting..."
      );

    }
  );


  return client;

}


// ==================================================
// DISCONNECT MQTT
// ==================================================
//
// Jangan dipanggil saat pindah halaman Dashboard
// ke Watering atau sebaliknya.
//
// Dipakai hanya jika benar-benar ingin memutus
// koneksi MQTT aplikasi.
// ==================================================

export function disconnectMQTT(
  onMessage
) {

  // Hapus listener halaman
  if (onMessage) {

    listeners.delete(
      onMessage
    );

  }


  // Jangan disconnect client
  // karena halaman lain mungkin masih menggunakannya

}


// ==================================================
// PUBLISH MANUAL WATERING
// ==================================================

export function publishManualWatering(
  status
) {

  if (
    !client ||
    !client.connected
  ) {

    console.log(
      "⚠️ MQTT belum terhubung"
    );

    return;

  }


  client.publish(

    TOPIC_MANUAL,

    status,

    (err) => {

      if (!err) {

        console.log(
          "📤 Manual Watering:",
          status
        );

      } else {

        console.log(
          "❌ Gagal Publish Manual Watering:",
          err
        );

      }

    }

  );

}


// ==================================================
// PUBLISH TIMER
// ==================================================

export function publishTimer(
  duration
) {

  if (
    !client ||
    !client.connected
  ) {

    console.log(
      "⚠️ MQTT belum terhubung"
    );

    return;

  }


  const message =
    JSON.stringify({

      duration:
        duration,

    });


  client.publish(

    TOPIC_TIMER,

    message,

    (err) => {

      if (!err) {

        console.log(
          "📤 Timer:",
          message
        );

      } else {

        console.log(
          "❌ Gagal Publish Timer:",
          err
        );

      }

    }

  );

}