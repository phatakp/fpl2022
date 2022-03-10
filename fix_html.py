import os

import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.production')
django.setup()
file_path = settings.BASE_DIR / "templates" / "index.html"
DJANGO_LOAD_STATIC = "{% load static %}"


def fix_html():
    with open(file_path, 'r+') as f:
        data = f.read()
        data = data[:15] + DJANGO_LOAD_STATIC + data[15:]
        fixed_data = add_django_static_to_files(data)
        f.seek(0)
        f.write(fixed_data)
        f.truncate()


def add_django_static_to_files(data):
    const1 = 'href="./static/'
    const2 = 'src="./static/'
    for i in range(len(data)):
        if data[i:i+len(const1)] == const1:
            data, i = fix_static(data, i, 6, const1)

        elif data[i:i+len(const2)] == const2:
            data, i = fix_static(data, i, 5, const2)
    return data


def fix_static(data, i, length, val):
    data = data[:i+length] + "{% static '" + data[i+len(val):]
    i += len(val)
    while True:
        if data[i] == '"':
            data = data[:i] + "' %}" + data[i:]
            break
        else:
            i += 1
    return data, i


if __name__ == '__main__':
    fix_html()
