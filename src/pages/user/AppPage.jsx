import React, { useState } from 'react';

function LandingPage() {
  const me = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      });
      const response = await res.json();
      console.log(response);
    } catch (error) {
      console.log("Nop, error");
    }
  };

  const newMe = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/user/newInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          mood: "Me siento biennnn",
          age: 19,
          password: "radiohead",
        }),
      });
      const response = await res.json();
      console.log(response);
    } catch (error) {
      console.log("Nop, error");
    }
  };







  const AvatarUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    };

    const handleSubmit = async () => {
      if (!file) return alert("Selecciona una imagen primero");

      const formData = new FormData();
      formData.append('avatar', file);
      console.log(formData);

      try {
        const res = await fetch("https://one2onebackend.onrender.com/api/user/newAvatar", {
          method: 'POST',
          body: formData,
          credentials: "include",

        });

        const response = await res.json();
        if (response.success) console.log(response.data.avatar);
      } catch (err) {
        console.error("Error subiendo foto", err);
      }
    };

    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3>Cambiar Avatar</h3>

        {preview && <img src={preview} alt="Vista previa" style={{ width: '100px', borderRadius: '50%' }} />}

        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br /><br />

        <button onClick={handleSubmit} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px' }}>
          Subir al Servidor
        </button>
      </div>
    );
  };


  return (
    <>
      <div>Hola esto es test c:</div>
      <form onSubmit={me}>
        <button type="submit">TESTTTTTTTT</button>
      </form>
      <form onSubmit={newMe}>
        <button type="submit">Nueva info</button>
      </form>
      <AvatarUpload />
    </>
  );
}
export default LandingPage;
