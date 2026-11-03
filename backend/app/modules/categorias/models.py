from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, max_length=100)
    descripcion: Optional[str] = None
    activo: bool = Field(default=True)

    productos: List["Producto"] = Relationship(back_populates="categoria")
