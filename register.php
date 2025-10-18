<?php
header('Content-Type: application/json');
include 'conexion.php';

$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$rol = $_POST['rol'] ?? 'ciudadano';

if (empty($nombre) || empty($email) || empty($password) || empty($rol)) {
  echo json_encode(["success" => false, "message" => "Completa todos los campos."]);
  exit;
}

// Verificar si ya existe el usuario
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
  exit;
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $hashed_password, $rol);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Cuenta creada correctamente."]);
} else {
  echo json_encode(["success" => false, "message" => "Error al registrar usuario."]);
}

$stmt->close();
$conn->close();
?>
