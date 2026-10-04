"""Seekable read-only file over HTTP range requests (used to read remote GeoParquet footers/row groups)."""
import io, requests

class HttpFile(io.RawIOBase):
    def __init__(self, url, session=None, block=1 << 20):
        self.url, self.s, self.block = url, session or requests.Session(), block
        for attempt in range(6):
            try:
                r = self.s.head(url, timeout=60); r.raise_for_status(); break
            except Exception:
                if attempt == 5: raise
                import time; time.sleep(1.5 * (attempt + 1))
        self.size = int(r.headers['Content-Length']); self.pos = 0; self.cache = {}
        self.bytes_fetched = 0
    def readable(self): return True
    def seekable(self): return True
    def tell(self): return self.pos
    def seek(self, off, whence=0):
        self.pos = off if whence == 0 else self.pos + off if whence == 1 else self.size + off
        return self.pos
    def _blk(self, i):
        if i not in self.cache:
            a = i * self.block; b = min(self.size, a + self.block) - 1
            for attempt in range(5):
                try:
                    r = self.s.get(self.url, headers={'Range': f'bytes={a}-{b}'}, timeout=120); r.raise_for_status(); break
                except Exception:
                    if attempt == 4: raise
                    import time; time.sleep(1.5 * (attempt + 1))
            self.cache[i] = r.content; self.bytes_fetched += len(r.content)
            if len(self.cache) > 256: self.cache.pop(next(iter(self.cache)))
        return self.cache[i]
    def read(self, n=-1):
        if n < 0: n = self.size - self.pos
        n = max(0, min(n, self.size - self.pos)); out = bytearray()
        while n > 0:
            i = self.pos // self.block; o = self.pos - i * self.block
            chunk = self._blk(i)[o:o + n]; out += chunk; self.pos += len(chunk); n -= len(chunk)
        return bytes(out)
    def readinto(self, b):
        d = self.read(len(b)); b[:len(d)] = d; return len(d)
