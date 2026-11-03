from typing import Optional

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.usuarios.models import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.username == username)
        return self.session.exec(query).first()

    def get_by_email(self, email: str) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.email == email)
        return self.session.exec(query).first()

    def listar(self) -> list[Usuario]:
        query = select(Usuario).order_by(Usuario.id)
        return list(self.session.exec(query).all())
