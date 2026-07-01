latest_detection = {}
edge_status = {
    'active': False,
    'inference': 'LOCAL',
    'model': 'YOLOv8n',
    'fps': 15,
    'device': 'CPU',
    'deployment': 'EDGE READY',
}

def update(data):
    global latest_detection
    latest_detection = data


def get():
    return latest_detection


def update_status(active: bool):
    edge_status['active'] = active


def get_status():
    return edge_status
