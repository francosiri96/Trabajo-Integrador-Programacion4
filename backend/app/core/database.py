from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# SQLite necesita este parametro para usarse desde FastAPI
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)


def create_all_tables():
    # Hay que importar los modelos para que SQLModel conozca las tablas
    from app.modules.usuarios import models as usuarios  # noqa: F401
    from app.modules.categorias import models as categorias  # noqa: F401
    from app.modules.productos import models as productos  # noqa: F401
    from app.modules.pedidos import models as pedidos  # noqa: F401

    SQLModel.metadata.create_all(engine)


def session_factory():
    return Session(engine)
