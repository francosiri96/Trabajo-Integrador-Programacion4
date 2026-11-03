from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario


class Pedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    estado: str = Field(default="PENDIENTE")
    forma_pago: str
    direccion_entrega: str = Field(max_length=200)
    notas: Optional[str] = None
    total: float = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    usuario: "Usuario" = Relationship(back_populates="pedidos")
    items: List["DetallePedido"] = Relationship(back_populates="pedido")


class DetallePedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    # Copia del producto al momento de la compra, para que no cambie despues
    nombre_producto: str
    precio_unitario: float
    subtotal: float

    pedido: "Pedido" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="detalles")
