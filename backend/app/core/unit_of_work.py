from app.core.database import session_factory


class UnitOfWork:
    """Abre la sesion al entrar al with y hace commit o rollback al salir."""

    def __enter__(self):
        self.session = session_factory()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
