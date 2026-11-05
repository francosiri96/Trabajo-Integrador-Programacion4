from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        # Los dos repositorios comparten la misma sesion, asi el pedido
        # y el descuento de stock se guardan (o se descartan) juntos
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
