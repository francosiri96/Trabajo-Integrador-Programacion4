from typing import Optional

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        # Busca tambien entre las dadas de baja, porque la baja no libera el nombre
        query = select(Categoria).where(Categoria.nombre == nombre)
        return self.session.exec(query).first()

    def listar_activas(self) -> list[Categoria]:
        query = select(Categoria).where(Categoria.activo == True).order_by(Categoria.nombre)  # noqa: E712
        return list(self.session.exec(query).all())
