<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sistema_reclamos";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$usuario_id = $_POST['usuario_id'] ?? '';
$titulo = $_POST['titulo'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$categoria = $_POST['categoria'] ?? '';

if (empty($usuario_id) || empty($titulo) || empty($descripcion)) {
  echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO reclamos (usuario_id, titulo, descripcion, categoria) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $usuario_id, $titulo, $descripcion, $categoria);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Reclamo registrado correctamente."]);
} else {
  echo json_encode(["success" => false, "message" => "Error al registrar el reclamo."]);
}

$stmt->close();
$conn->close();
?>

