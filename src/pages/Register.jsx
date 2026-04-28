import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import styles from '../styles/AuthPage.module.css';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const validate = () => {
    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();

    if (!name) return 'El nombre es obligatorio.';
    if (!email) return 'El correo es obligatorio.';
    if (!EMAIL_REGEX.test(email)) return 'Correo inválido.';
    if (!values.password || values.password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres.';
    if (values.password !== values.confirmPassword)
      return 'Las contraseñas no coinciden.';

    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = register({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // 🔥 opcional: limpiar formulario
    setValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    navigate('/user/profile', { replace: true });
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Semana 11</p>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Registra un usuario local para mantener sesión y asociar compras a tu perfil.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Nombre</span>
            <input
              className={styles.input}
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ej: Ana Gómez"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Correo electrónico</span>
            <input
              className={styles.input}
              name="email"
              value={values.email}
              onChange={handleChange}
              type="email"
              placeholder="correo@dominio.com"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              name="password"
              value={values.password}
              onChange={handleChange}
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Confirmar contraseña</span>
            <input
              className={styles.input}
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Repite la contraseña"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.primaryButton}>
            Crear cuenta
          </button>
        </form>

        <p className={styles.helperText}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
        </p>
      </div>
    </section>
  );
}

export default Register;