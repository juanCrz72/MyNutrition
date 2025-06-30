import React, { useEffect, useState } from 'react';
import {
  subirImagenAlimento,
  obtenerTodasLasImagenesAlimentos,
  eliminarImagenAlimentoPorId,
} from '../../api/DocumentosAlimentos.api.js';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';

const GestionImagenesAlimentos = () => {
  const [archivo, setArchivo] = useState(null);
  const [idAlimento, setIdAlimento] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const cargarImagenes = async () => {
    setCargando(true);
    try {
      const data = await obtenerTodasLasImagenesAlimentos();
      setImagenes(data);
    } catch (error) {
      setMensaje({ texto: 'Error al cargar las imágenes', tipo: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarImagenes();
  }, []);

  const handleSubirImagen = async (e) => {
    e.preventDefault();
    if (!archivo || !idAlimento) {
      setMensaje({ texto: 'Por favor, selecciona un archivo e ingresa el ID de alimento.', tipo: 'warning' });
      return;
    }

    setCargando(true);
    try {
      await subirImagenAlimento(idAlimento, archivo);
      setMensaje({ texto: 'Imagen subida correctamente.', tipo: 'success' });
      setArchivo(null);
      setIdAlimento('');
      document.getElementById('form-file').value = ''; // Limpiar input file
      await cargarImagenes();
    } catch (error) {
      setMensaje({ texto: 'Error al subir la imagen.', tipo: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      setCargando(true);
      try {
        await eliminarImagenAlimentoPorId(id);
        setMensaje({ texto: 'Imagen eliminada correctamente.', tipo: 'success' });
        await cargarImagenes();
      } catch (err) {
        setMensaje({ texto: 'Error al eliminar la imagen.', tipo: 'danger' });
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Gestión de Imágenes de Alimentos</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubirImagen}>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="idAlimento" className="mb-3">
                      <Form.Label>ID Alimento</Form.Label>
                      <Form.Control
                        type="text"
                        value={idAlimento}
                        onChange={(e) => setIdAlimento(e.target.value)}
                        required
                        placeholder="Ingrese el ID"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group controlId="form-file" className="mb-3">
                      <Form.Label>Seleccionar imagen</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setArchivo(e.target.files[0])}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" disabled={cargando}>
                      {cargando ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span className="visually-hidden">Cargando...</span>
                        </>
                      ) : (
                        'Subir Imagen'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {mensaje.texto && (
        <Row className="mb-3">
          <Col md={8} className="mx-auto">
            <Alert variant={mensaje.tipo} onClose={() => setMensaje({ texto: '', tipo: '' })} dismissible>
              {mensaje.texto}
            </Alert>
          </Col>
        </Row>
      )}

      {cargando && imagenes.length === 0 ? (
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando imágenes...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {imagenes.map((img) => (
            <Col key={img.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`/${img.localizacion}`}
                  alt={img.nombre_original}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/no-image.png';
                  }}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="h6">ID: {img.idAlimento}</Card.Title>
                  <Card.Text className="text-muted small">
                    {img.nombre_documento}
                  </Card.Text>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleEliminar(img.id)}
                    disabled={cargando}
                  >
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GestionImagenesAlimentos;