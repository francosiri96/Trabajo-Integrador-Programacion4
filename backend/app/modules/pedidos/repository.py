from datetime import datetime
from typing import Optional

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def _paginar(self, query, skip: int, limit: int) -> tuple[int, list[Pedido]]:
        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        # Los mas nuevos primero
        items = self.session.exec(query.order_by(col(Pedido.id).desc()).offset(skip).limit(limit)).all()
        return total, list(items)

    def list_by_usuario(
        self, usuario_id: int, skip: int, limit: int, estado: Optional[str] = None
    ) -> tuple[int, list[Pedido]]:
        query = select(Pedido).where(Pedido.usuario_id == usuario_id)
        if estado:
            query = query.where(Pedido.estado == estado)
        return self._paginar(query, skip, limit)

    def list_todos(self, skip: int, limit: int, estado: Optional[str] = None) -> tuple[int, list[Pedido]]:
        query = select(Pedido)
        if estado:
            query = query.where(Pedido.estado == estado)
        return self._paginar(query, skip, limit)

    def agregar_detalle(self, detalle: DetallePedido) -> None:
        self.session.add(detalle)
        self.session.flush()

    def count_by_estado(self, estado: str) -> int:
        query = select(func.count(Pedido.id)).where(Pedido.estado == estado)
        return self.session.exec(query).one()

    def count_de_hoy(self) -> int:
        inicio_del_dia = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        query = select(func.count(Pedido.id)).where(Pedido.created_at >= inicio_del_dia)
        return self.session.exec(query).one()

    def suma_total_por_estado(self, estado: str) -> float:
        query = select(func.sum(Pedido.total)).where(Pedido.estado == estado)
        suma = self.session.exec(query).one()
        # Si no hay pedidos, sum devuelve None
        return suma or 0
