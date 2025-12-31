import time

_cache = {
    "data": None,
    "timestamp": 0
}

CACHE_TTL = 600  # 10 minutes

def get_cached_data():
    if time.time() - _cache["timestamp"] < CACHE_TTL:
        return _cache["data"]
    return None

def set_cache(data):
    _cache["data"] = data
    _cache["timestamp"] = time.time()
