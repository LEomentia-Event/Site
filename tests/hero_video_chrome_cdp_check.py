"""
Focused browser-level check using the system Chrome/Chromium DevTools Protocol.
This avoids relying on Python Playwright being installed while still measuring the
real DOM media state for the reported homepage hero video playback bug.
"""

import asyncio
import json
import subprocess
import tempfile
import time
from pathlib import Path

import requests
import websockets


URL = "https://leomentia-preview.preview.emergentagent.com/"
OUT = Path("/app/test_reports/hero_video_chrome_cdp_runtime.json")
CHROME = "/usr/bin/google-chrome"


class CDP:
    def __init__(self, ws):
        self.ws = ws
        self.next_id = 0
        self.events = []

    async def send(self, method, params=None):
        self.next_id += 1
        msg_id = self.next_id
        await self.ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(await self.ws.recv())
            if msg.get("id") == msg_id:
                return msg
            self.events.append(msg)


async def main():
    tmp = tempfile.TemporaryDirectory()
    port = 9224
    proc = subprocess.Popen(
        [
            CHROME,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--autoplay-policy=no-user-gesture-required",
            "--mute-audio",
            "--window-size=1920,1080",
            f"--remote-debugging-port={port}",
            f"--user-data-dir={tmp.name}",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        deadline = time.time() + 15
        version = None
        while time.time() < deadline:
            try:
                version = requests.get(f"http://127.0.0.1:{port}/json/version", timeout=1).json()
                break
            except Exception:
                time.sleep(0.2)
        if not version:
            raise RuntimeError("Chrome DevTools did not become available")

        target = requests.put(f"http://127.0.0.1:{port}/json/new?{URL}", timeout=5).json()
        ws_url = target["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url, max_size=16 * 1024 * 1024) as ws:
            cdp = CDP(ws)
            await cdp.send("Page.enable")
            await cdp.send("Runtime.enable")
            await cdp.send("Network.enable")
            # Ensure URL is loaded even if /json/new ignored the query URL.
            await cdp.send("Page.navigate", {"url": URL})
            await asyncio.sleep(12)
            expression = r"""
            (() => {
              const v = document.querySelector('[data-testid="hero-video"]');
              const title = document.querySelector('h1')?.innerText || '';
              if (!v) return {exists:false, location: location.href, body: document.body?.innerText?.slice(0,200)};
              const cs = getComputedStyle(v);
              const rect = v.getBoundingClientRect();
              return {
                exists: true,
                location: location.href,
                canPlayMp4: document.createElement('video').canPlayType('video/mp4'),
                canPlayH264: document.createElement('video').canPlayType('video/mp4; codecs="avc1.4D403C, mp4a.40.2"'),
                readyState: v.readyState,
                networkState: v.networkState,
                paused: v.paused,
                muted: v.muted,
                defaultMuted: v.defaultMuted,
                autoplay: v.autoplay,
                loop: v.loop,
                playsInline: v.playsInline,
                currentTime: v.currentTime,
                duration: v.duration,
                error: v.error ? {code: v.error.code, message: v.error.message} : null,
                opacity: cs.opacity,
                objectPosition: cs.objectPosition,
                objectFit: cs.objectFit,
                rect: {width: rect.width, height: rect.height},
                titleVisible: title.includes('Organisez votre mariage') && title.includes('sans stress'),
                servicesCtaVisible: !!document.querySelector('[data-testid="cta-services"]')?.offsetParent,
                calendlyCtaVisible: !!document.querySelector('[data-testid="cta-calendly-hero"]')?.offsetParent
              };
            })()
            """
            initial = (await cdp.send("Runtime.evaluate", {"expression": expression, "returnByValue": True}))["result"]["result"]["value"]
            passive_samples = [initial]
            for _ in range(3):
                await asyncio.sleep(1)
                passive_samples.append(
                    (await cdp.send("Runtime.evaluate", {"expression": expression, "returnByValue": True}))["result"]["result"]["value"]
                )
            # Normalize the playback position so a short looping video cannot wrap
            # between readings and falsely look like time did not advance.
            await cdp.send(
                "Runtime.evaluate",
                {
                    "expression": """(() => { const v = document.querySelector('[data-testid="hero-video"]'); if (v) { v.currentTime = 0; v.muted = true; v.defaultMuted = true; v.play(); } })()""",
                    "returnByValue": True,
                },
            )
            await asyncio.sleep(0.25)
            first = (await cdp.send("Runtime.evaluate", {"expression": expression, "returnByValue": True}))["result"]["result"]["value"]
            await asyncio.sleep(3)
            second = (await cdp.send("Runtime.evaluate", {"expression": expression, "returnByValue": True}))["result"]["result"]["value"]
            result = {
                "browser": version,
                "initial_after_page_load": initial,
                "passive_autoplay_samples_1s_apart": passive_samples,
                "motion_first_reading_after_seek_to_0": first,
                "motion_second_reading_after_3s": second,
                "current_time_advanced": second.get("currentTime", 0) > first.get("currentTime", 0) + 0.5,
                "passive_current_time_changed": max(s.get("currentTime", 0) for s in passive_samples) - min(s.get("currentTime", 0) for s in passive_samples) > 0.5,
                "network_events_for_stream": [
                    e for e in cdp.events if "/api/drive/stream/" in json.dumps(e)
                ],
            }
            result["passed"] = (
                initial.get("readyState", 0) >= 3
                and second.get("readyState", 0) >= 3
                and initial.get("paused") is False
                and second.get("paused") is False
                and result["passive_current_time_changed"]
                and result["current_time_advanced"]
                and initial.get("error") is None
                and second.get("error") is None
                and float(second.get("opacity", 0)) >= 0.99
                and initial.get("titleVisible") is True
                and initial.get("servicesCtaVisible") is True
                and initial.get("calendlyCtaVisible") is True
                and "35%" in initial.get("objectPosition", "")
            )
        OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False))
        print(json.dumps(result, indent=2, ensure_ascii=False))
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        tmp.cleanup()


if __name__ == "__main__":
    asyncio.run(main())