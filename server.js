const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Verificar variable de entorno
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let citasCollection;

async function conectarDB() {
  try {
    await client.connect();
    const db = client.db("barberiaDB");
    citasCollection = db.collection("citas");
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar MongoDB:", err);
  }
}
conectarDB();

// Rutas API
app.get('/api/citas', async (req, res) => {
  const citas = await citasCollection.find({}).toArray();
  res.json(citas);
});

app.post('/api/citas', async (req, res) => {
  const nuevaCita = req.body;
  const result = await citasCollection.insertOne(nuevaCita);
  res.json(result);
});

app.delete('/api/citas/:id', async (req, res) => {
  const id = req.params.id;
  const result = await citasCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
