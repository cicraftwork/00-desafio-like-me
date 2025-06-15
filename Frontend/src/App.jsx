import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

const urlBaseServer = "http://localhost:3000";

function App() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const { data: posts } = await axios.get(urlBaseServer + "/posts");
      setPosts([...posts]);
    } catch (error) {
      console.error("Error al obtener posts:", error);
    }
  };

  // ✅ Función actualizada que recibe parámetros directos
  const agregarPost = async (titulo, url, descripcion) => {
    try {
      const post = { titulo, url, descripcion };
      await axios.post(urlBaseServer + "/posts", post);

      // Actualizar la lista de posts después de agregar
      await getPosts();

      console.log("✅ Post agregado exitosamente");
    } catch (error) {
      console.error("❌ Error al agregar post:", error);
      throw error; // Re-lanzar error para que Form.jsx pueda manejarlo
    }
  };


<<<<<<< HEAD
  // MÉTODOS PARA DESAFÍO LIKE ME II


=======
//SIGUIENTE DESAFÍO


// LIke
>>>>>>> 0ab04e75230dbfb952be0c0d016f8de6ec216253
  const like = async (id) => {
    try {
      await axios.put(urlBaseServer + `/posts/like/${id}`);
      getPosts();
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

<<<<<<< HEAD
=======
  // eliminar
>>>>>>> 0ab04e75230dbfb952be0c0d016f8de6ec216253
  const eliminarPost = async (id) => {
    try {
      await axios.delete(urlBaseServer + `/posts/${id}`);
      getPosts();
    } catch (error) {
      console.error("Error al eliminar post:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form agregarPost={agregarPost} />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={i}
              post={post}
              like={like}
              eliminarPost={eliminarPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;