from .realtime_manager import RealtimeManager
from .state_manager import update_status

edge_manager = RealtimeManager()


def start_edge(source=0) -> bool:
    if edge_manager.running:
        edge_manager.stop()

    edge_manager.source = source
    started = edge_manager.start()
    if not started:
        update_status(False)
        return False

    edge_manager.start_background()
    update_status(True)
    return True


def stop_edge():
    if edge_manager.running:
        edge_manager.stop()
    update_status(False)
