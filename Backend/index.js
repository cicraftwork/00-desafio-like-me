const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000; // Puerto que espera el frontend


app.use(cors());

// Middleware
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1209',
  database: 'likeme',
  port: 5432,
  allowExitOnIdle: true
});

// Función test conexión a la base de datos
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
  }
};

// RUTA GET
app.get('/posts', async (req, res) => {
  try {
    console.log('📥 GET /posts - Obteniendo todos los posts');

    const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    const posts = result.rows;

    console.log(`✅ Posts encontrados: ${posts.length}`);

    res.json(posts);
  } catch (error) {
    console.error('❌ Error en GET /posts:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

//RUTA POST
app.post('/posts', async (req, res) => {
  try {
    console.log('📤 POST /posts - Datos recibidos:', req.body);

    const { titulo, url, descripcion } = req.body;

    // Validación básica
    if (!titulo || !url || !descripcion) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['titulo', 'url', 'descripcion']
      });
    }

    // Consulta evitar SQL Injection
    const consulta = `
      INSERT INTO posts (titulo, img, descripcion, likes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const valores = [titulo, url, descripcion, 0]; // likes parte en 0

    const result = await pool.query(consulta, valores);
    const nuevoPost = result.rows[0];

    console.log('✅ Post creado exitosamente:', nuevoPost);

    res.status(201).json({
      message: 'Post agregado con éxito',
      post: nuevoPost
    });

  } catch (error) {
    console.error('❌ Error en POST /posts:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});



// RUTAS Desafío Like Me II


// Ruta like a un post
app.put('/posts/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👍 PUT /posts/like/${id} - Incrementando like`);

    const consulta = `
      UPDATE posts
      SET likes = likes + 1
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(consulta, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const postActualizado = result.rows[0];
    console.log('✅ Like agregado:', postActualizado);

    res.json({
      message: 'Like agregado exitosamente',
      post: postActualizado
    });

  } catch (error) {
    console.error('❌ Error en PUT /posts/like:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// Ruta eliminar post
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /posts/${id} - Eliminando post`);

    const consulta = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const result = await pool.query(consulta, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const postEliminado = result.rows[0];
    console.log('✅ Post eliminado:', postEliminado);

    res.json({
      message: 'Post eliminado exitosamente',
      post: postEliminado
    });

  } catch (error) {
    console.error('❌ Error en DELETE /posts:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});


// INICIAR SERVIDOR

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📊 Rutas disponibles:');
  console.log('   GET    /posts           - Obtener todos los posts');
  console.log('   POST   /posts           - Crear nuevo post');
  console.log('   PUT    /posts/like/:id  - Dar like a un post');
  console.log('   DELETE /posts/:id       - Eliminar un post');
  console.log('');

  // Probar conexión a la base de datos
  testConnection();
});