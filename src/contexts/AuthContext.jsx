import { createContext, useMemo, useState } from 'react';

import {
  clearSessionUser,
  createUser,
  findUserByEmail,
  loadSessionUser,
  saveSessionUser,
} from '../utils/authStorage';

const AuthContext = createContext(null);

// 🔐 helper simple (mejor que texto plano)
const hashPassword = (password) => {
  return btoa(password); // básico (no seguro real, pero mejor que plano)
};

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSessionUser);

  const register = ({ name, email, password }) => {
    const normalizedEmail = String(email ?? '').trim().toLowerCase();

    if (!name?.trim()) {
      return { ok: false, error: 'Ingresa un nombre para crear la cuenta.' };
    }

    if (!normalizedEmail) {
      return { ok: false, error: 'Ingresa un correo electrónico válido.' };
    }

    if (!password || password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    if (findUserByEmail(normalizedEmail)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con ese correo.' };
    }

    const user = createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    saveSessionUser(sessionUser);
    setCurrentUser(sessionUser);

    return { ok: true, user: sessionUser };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = String(email ?? '').trim().toLowerCase();

    const user = findUserByEmail(normalizedEmail);

    if (!user || user.password !== hashPassword(password)) {
      return { ok: false, error: 'Credenciales inválidas.' };
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
    };

    saveSessionUser(sessionUser);
    setCurrentUser(sessionUser);

    return { ok: true, user: sessionUser };
  };

  const logout = () => {
    clearSessionUser();
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      register,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };