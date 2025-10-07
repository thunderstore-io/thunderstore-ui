import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Union, Dict, Optional

import requests


CURRENT_DIR = Path(__file__).parent
REPO_ROOT = CURRENT_DIR / ".." / ".."
YARN_PATH = shutil.which("yarn")


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


def setup_frontend():
    run_command([YARN_PATH, "install", "--frozen-lockfile"], cwd=REPO_ROOT)
    run_command([YARN_PATH, "playwright", "install"], cwd=REPO_ROOT)


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


BACKEND_DIR = REPO_ROOT / "tools" / "thunderstore-test-backend"


def start_backend() -> bool:
    run_command("docker compose up -d", cwd=BACKEND_DIR)
    return wait_for_url("http://127.0.0.1:8000/")


def stop_backend():
    run_command("docker compose down", cwd=BACKEND_DIR)


def run_tests():
    # TODO: Enable tests with coverage run when decision has been made on testing strategy/policy regarding e2e tests
    # run_command([YARN_PATH, "coverage"], cwd=REPO_ROOT)
    run_command([YARN_PATH, "test"], cwd=REPO_ROOT)


def main():
    print("Setting up frontend")
    setup_frontend()
    backend_success = start_backend()

    if backend_success:
        print("Successfully launched backend!")
    else:
        print("Failed to launch backend!")
        stop_backend()
        raise EarlyExit(1)

    try:
        run_tests()
    except Exception as e:
        print(f"Exception: {e}")
        stop_backend()
        raise e

    stop_backend()
    print("Done")


if __name__ == "__main__":
    try:
        main()
    except EarlyExit as e:
        e.exit()
