import { useState } from "react";

function Form({ agregarPost }) {
  // Estados locales para manejar los valores del formulario
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    // Validación básica
    if (!titulo.trim() || !imgSrc.trim() || !descripcion.trim()) {
      alert("Por favor, completa todos los campos");
      return;
    }

    try {
      // Llamar a la función de agregar post del componente padre
      await agregarPost(titulo, imgSrc, descripcion);

      // LIMPIAR FORMULARIO después de agregar exitosamente
      setTitulo("");
      setImgSrc("");
      setDescripcion("");

      console.log("✅ Post agregado y formulario limpiado");
    } catch (error) {
      console.error("❌ Error al agregar post:", error);
      alert("Error al agregar el post");
    }
  };

  return (
    <div className="form">
      <div className="mb-2">
        <h6>Agregar post</h6>
        <label>Título</label>
        <input
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          className="form-control"
          placeholder="Ingresa el título del post"
        />
      </div>
      <div className="mb-2">
        <label>URL de la imagen</label>
        <input
          value={imgSrc}
          onChange={(event) => setImgSrc(event.target.value)}
          className="form-control"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      <div className="mb-3">
        <label>Descripción</label> <br />
        <textarea
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
          className="form-control"
          placeholder="Describe tu post"
          rows="3"
        ></textarea>
      </div>
      <div className="d-flex">
        <button
          onClick={handleSubmit}
          className="btn btn-light m-auto"
          disabled={!titulo.trim() || !imgSrc.trim() || !descripcion.trim()}
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

export default Form;