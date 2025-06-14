import app from "./app.js";

const port = 3000; 

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default port; 
