from typing import Optional

from fastapi import Cookie, Depends, HTTPException, status

from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository


def get_current_user(access_token: Optional[str] = Cookie(default=None)) -> Usuario:
    """Lee el JWT de la cookie y busca al usuario."""
    if access_token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "No hay sesión iniciada")

    username = decode_access_token(access_token)
    if username is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "La sesión es inválida o venció")

    with session_factory() as session:
        usuario = UsuarioRepository(session).get_by_username(username)

    if usuario is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "La sesión es inválida o venció")
    return usuario


def get_current_active_user(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    if usuario.disabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cuenta de usuario desactivada")
    return usuario


def require_role(roles: list[str]):
    """Devuelve una dependencia que deja pasar solo a los roles indicados."""

    def verificar_rol(usuario: Usuario = Depends(get_current_active_user)) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "No tenés permiso para esta acción")
        return usuario

    return verificar_rol
