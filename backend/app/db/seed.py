"""Carga datos iniciales. Se puede correr varias veces sin duplicar nada.

Uso: python -m app.db.seed
"""
from sqlmodel import select

from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

CATEGORIAS = [
    {"nombre": "Hamburguesas", "descripcion": "Hamburguesas caseras"},
    {"nombre": "Pizzas", "descripcion": "Pizzas al horno de barro"},
    {"nombre": "Bebidas", "descripcion": "Gaseosas, aguas y jugos"},
]

PRODUCTOS = [
    {"nombre": "Hamburguesa clásica", "categoria": "Hamburguesas", "precio_base": 8500, "stock": 20},
    {"nombre": "Hamburguesa doble cheddar", "categoria": "Hamburguesas", "precio_base": 11000, "stock": 15},
    {"nombre": "Hamburguesa veggie", "categoria": "Hamburguesas", "precio_base": 9000, "stock": 10},
    {"nombre": "Pizza muzzarella", "categoria": "Pizzas", "precio_base": 10000, "stock": 12},
    {"nombre": "Pizza napolitana", "categoria": "Pizzas", "precio_base": 12000, "stock": 10},
    {"nombre": "Pizza fugazzeta", "categoria": "Pizzas", "precio_base": 11500, "stock": 8},
    {"nombre": "Gaseosa 500ml", "categoria": "Bebidas", "precio_base": 2500, "stock": 50},
    {"nombre": "Agua mineral 500ml", "categoria": "Bebidas", "precio_base": 1800, "stock": 40},
]


def crear_admin(session):
    admin = session.exec(select(Usuario).where(Usuario.username == "admin")).first()
    if admin is None:
        admin = Usuario(
            username="admin",
            full_name="Administrador",
            email="admin@foodstore.com",
            hashed_password=hash_password("Admin1234!"),
            role="admin",
        )
        session.add(admin)
        print("Usuario admin creado")


def crear_categorias(session):
    for datos in CATEGORIAS:
        existe = session.exec(select(Categoria).where(Categoria.nombre == datos["nombre"])).first()
        if existe is None:
            session.add(Categoria(nombre=datos["nombre"], descripcion=datos["descripcion"]))
            print("Categoría creada:", datos["nombre"])
    # flush para que las categorías nuevas tengan id antes de crear los productos
    session.flush()


def crear_productos(session):
    for datos in PRODUCTOS:
        existe = session.exec(select(Producto).where(Producto.nombre == datos["nombre"])).first()
        if existe is not None:
            continue

        categoria = session.exec(select(Categoria).where(Categoria.nombre == datos["categoria"])).first()
        texto_imagen = datos["nombre"].replace(" ", "+")
        producto = Producto(
            nombre=datos["nombre"],
            descripcion="Producto de Food Store",
            precio_base=datos["precio_base"],
            stock=datos["stock"],
            imagen_url="https://placehold.co/400x300?text=" + texto_imagen,
            categoria_id=categoria.id,
        )
        session.add(producto)
        print("Producto creado:", datos["nombre"])


def main():
    create_all_tables()
    with session_factory() as session:
        crear_admin(session)
        crear_categorias(session)
        crear_productos(session)
        session.commit()
    print("Seed terminado")


if __name__ == "__main__":
    main()
