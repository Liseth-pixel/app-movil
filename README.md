# 📱 QRESENTE - Sistema de Asistencia con Códigos QR

QRESENTE es una aplicación móvil y web desarrollada con **React Native (Expo)** y **Supabase** que permite automatizar y gestionar el control de asistencia escolar mediante códigos QR.

## 🚀 Características Principales

* **Autenticación Segura**: Sistema de inicio de sesión basado en roles (Docentes y Estudiantes) utilizando Supabase Auth.
* **Panel de Estudiante**:
  * Generación de código QR personal basado en el carnet o identificación del alumno.
  * Visualización del historial de asistencias registradas.
* **Panel de Docente**:
  * Gestión de estudiantes.
  * Módulo para escaneo de códigos QR (próximamente integrado por completo).
  * Registro y control de asistencias por materia o clase.

## 🛠️ Tecnologías Utilizadas

* **Frontend**: React Native, Expo, React Navigation.
* **Backend / Base de Datos**: Supabase (PostgreSQL, Autenticación y Tablas relacionales).
* **Generación de QR**: `react-native-qrcode-svg`.

## 📦 Instalación y Configuración Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu computadora:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
