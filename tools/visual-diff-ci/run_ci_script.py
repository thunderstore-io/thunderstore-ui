import os
import shutil
import subprocess
import sys
import time
from distutils.util import strtobool
from pathlib import Path
from typing import List, Union, Dict, Optional

import requests


CURRENT_DIR = Path(__file__).parent
REPO_ROOT = CURRENT_DIR / ".." / ".."
YARN_PATH = shutil.which("yarn")
NPX_PATH = shutil.which("npx")
NPM_PATH = shutil.which("npm")


class EarlyExit(Exception):
    def __init__(self, status_code: int):
        self.status_code = status_code

    def exit(self):
        sys.exit(self.status_code)


class EnvironmentVariable:
    def __init__(self, cast, name, default):
        self.cast = cast
        self.name = name
        self.default = default

    @property
    def value(self):
        val = os.environ.get(self.name, self.default)
        if self.cast is not None and val is not None and isinstance(val, str):
            val = self.cast(val)
        return val

    @value.setter
    def value(self, val):
        if val is None and self.name in os.environ:
            del os.environ[self.name]
        else:
            os.environ[self.name] = str(val)

    def __str__(self):
        if self.value is None:
            return ""
        return str(self.value)

    def __bool__(self):
        return bool(self.value)


VARIABLES = {}


def build_command(parts: Union[List[Union[EnvironmentVariable, str]], str]) -> List[str]:
    if isinstance(parts, str):
        command = parts.split(" ")
    else:
        command = [str(x) for x in parts]
    return command


def build_env() -> Dict[str, str]:
    environment = {
        **os.environ,
        **({k: str(v) for k, v in VARIABLES.items() if v is not None}),
    }
    return environment


def run_command(
    command: Union[List[Union[EnvironmentVariable, str]], str],
    cwd: Optional[Path] = None,
) -> int:
    environment = build_env()
    command = build_command(command)
    cwd = cwd or CURRENT_DIR
    print(str(cwd.resolve()) + ": " + " ".join(command))
    result = subprocess.call(command, env=environment, cwd=cwd)
    if result != 0:
        raise EarlyExit(result)
    return result


def register_variable(cast, name, default) -> EnvironmentVariable:
    var = EnvironmentVariable(cast, name, default)
    VARIABLES[name] = var
    return var


def to_bool(val) -> bool:
    if not val:
        return False
    return bool(strtobool(val))


PERCY_TOKEN = register_variable(str, "PERCY_TOKEN", None)


class BgProcess:
    process: subprocess.Popen

    def __init__(
        self,
        command: Union[List[Union[EnvironmentVariable, str]], str],
        cwd: Optional[Path] = None,
        env: Optional[Dict[str, str]] = None,
    ):
        command = build_command(command)
        cwd = cwd or CURRENT_DIR
        print(str(cwd.resolve()) + ": " + " ".join(command))
        env = {
            **build_env(),
            **(env or {}),
        }
        self.process = subprocess.Popen(
            command,
            cwd=cwd,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

    def kill(self):
        self.process.kill()


def setup_frontend():
    run_command([YARN_PATH, "install", "--frozen-lockfile"], cwd=REPO_ROOT)
    run_command([YARN_PATH, "workspace", "@thunderstore/cyberstorm-remix", "build"], cwd=REPO_ROOT)


def start_frontend() -> BgProcess:
    configs = {
        "PUBLIC_SITE_URL": "http://127.0.0.1:8000",
        "PUBLIC_API_URL": "http://127.0.0.1:8000",
        "PUBLIC_AUTH_URL": "http://127.0.0.1:8000",
    }
    process = BgProcess(
        [YARN_PATH, "workspace", "@thunderstore/cyberstorm-remix", "start", "--host", "0.0.0.0", "--port", "3000"],
        cwd=REPO_ROOT,
        env=configs,
    )
    return process


def wait_for_url(url: str) -> bool:
    def poll_backend() -> bool:
        try:
            resp = requests.get(url, timeout=3)
            return resp.status_code == 200
        except Exception:
            return False

    timeout_threshold = time.time() + 60
    while (result := poll_backend()) is False and time.time() < timeout_threshold:
        print(
            "Polling failed, "
            f"retrying for {timeout_threshold - time.time():.2f} seconds"
        )
        time.sleep(1)

    return result


BACKEND_DIR = REPO_ROOT / "tools" / "visual-diff-backend"


def start_backend() -> bool:
    run_command("docker compose up -d", cwd=BACKEND_DIR)
    return wait_for_url("http://127.0.0.1:8000/")


def stop_backend():
    run_command("docker compose down", cwd=BACKEND_DIR)


PLAYWRIGHT_DIR = (REPO_ROOT / "tools" / "cyberstorm-playwright").resolve()


def run_playwright():
    # try:
    run_command([NPM_PATH, "ci"], cwd=PLAYWRIGHT_DIR)
    run_command([NPX_PATH, "playwright", "install", "--with-deps"], cwd=PLAYWRIGHT_DIR)
    run_command([NPX_PATH, "percy", "exec", "--", "playwright", "test", "--reporter=list"], cwd=PLAYWRIGHT_DIR)


def main():
    print("Setting up frontend")
    setup_frontend()
    backend_success = start_backend()

    if backend_success:
        print("Successfully launched backend!")
    else:
        print("Failed to launch backend!")

    print("Starting frontend")
    process = start_frontend()
    wait_for_url("http://127.0.0.1:3000")

    try:
        run_playwright()
    except Exception as e:
        print(f"Exception: {e}")
        process.kill()
        stop_backend()
        raise e

    stop_backend()
    process.kill()
    print("Done")


if __name__ == "__main__":
    try:
        main()
    except EarlyExit as e:
        e.exit()
