import os
import subprocess
import sys
from distutils.util import strtobool
from typing import List, Union


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


def run_command(command: Union[List[Union[EnvironmentVariable, str]], str]) -> int:
    environment = {
        **os.environ,
        **({k: str(v) for k, v in VARIABLES.items() if v is not None}),
    }
    if isinstance(command, str):
        command = command.split(" ")
    else:
        command = [str(x) for x in command]
    print(" ".join(command))
    result = subprocess.call(command, env=environment)
    if result != 0:
        sys.exit(result)
    return result


def register_variable(cast, name, default):
    var = EnvironmentVariable(cast, name, default)
    VARIABLES[name] = var
    return var


def to_bool(val) -> bool:
    if not val:
        return False
    return bool(strtobool(val))


def run_migrations():
    run_command("python manage.py migrate community")
    run_command("python fix_migration.py")
    run_command("python manage.py migrate")


def create_data():
    run_command("python manage.py create_test_data --community-count=3 --team-count=2 --package-count=5 --version-count=5 --dependency-count=3 --contract-count=0 --contract-version-count=0 --wiki-page-count=3 --reuse-icon")


def launch_server():
    run_command("python docker_entrypoint.py django")


def main():
    run_migrations()
    create_data()
    launch_server()


if __name__ == "__main__":
    main()
