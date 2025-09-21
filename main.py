from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json
import os

from starlette.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

stack_icons = {
    "Python 3.11": "fab fa-python",
    "Django 4.2": "fab fa-python",
    "Django 5": "fab fa-python",
    "PostgreSQL 15": "fas fa-database",
    "MySQL 8": "fas fa-database",
    "SQLite": "fas fa-database",
    "OpenAI API": "fas fa-robot",
    "Bitrix24 REST API": "fas fa-plug",
    "Bitrix24 API": "fas fa-plug",
    "AmoCRM API": "fas fa-plug",
    "Speech2Text API": "fas fa-microphone",
    "Redis": "fas fa-memory",
    "Nginx": "fas fa-server",
    "Docker": "fab fa-docker",
    "Docker SDK": "fab fa-docker",
    "Debian 11": "fab fa-linux",
    "Ubuntu 24": "fab fa-ubuntu",
    "REST": "fas fa-exchange-alt",
    "Websockets": "fas fa-network-wired",
    "Pyrogram 2": "fab fa-telegram",
    "Telegram API": "fab fa-telegram",
    "Blockchain": "fas fa-link",
    "PHP 8.1": "fab fa-php",
    "PHP 8.2": "fab fa-php",
    "Laravel 10": "fab fa-laravel",
    "Laravel 11": "fab fa-laravel",
    "C# .NET Framework 8": "fab fa-cuttlefish",
    "RestoFrontAPI 8": "fas fa-code",
    "Unity 2021": "fa-brands fa-unity",
    "Unity 2023": "fa-brands fa-unity",
    "Java SDK": "fab fa-java",
    "Unity 6": "fa-brands fa-unity",
    "C# 8.0": "fab fa-cuttlefish",
}

AVAILABLE_LANGUAGES = ["en", "ru"]


def lang_file(lang: str, file: str):
    return f"content/{lang}/{file}"


@app.get("/", response_class=HTMLResponse)
async def root(request: Request, lang="en"):

    if lang not in AVAILABLE_LANGUAGES:
        lang = "en"

    request.lang = lang

    file_page = lang_file(lang, "page.json")
    file_profile = lang_file(lang, "profile.json")
    file_projects = lang_file(lang, "projects.json")

    page = {}
    if os.path.exists(file_page):
        with open(file_page, 'r', encoding='utf-8') as f:
            page = json.load(f)

    profile = {}
    if os.path.exists(file_profile):
        with open(file_profile, 'r', encoding='utf-8') as f:
            profile = json.load(f)

    projects = []
    if os.path.exists(file_projects):
        with open(file_projects, 'r', encoding='utf-8') as f:
            projects = json.load(f)

        for project in projects:
            pictures_folder = project.get("pictures", "")
            if pictures_folder:
                picture_path = f"static/pictures/{pictures_folder}"
                if os.path.exists(picture_path):
                    project["images"] = [
                        f"/static/pictures/{pictures_folder}/{img}"
                        for img in sorted(os.listdir(picture_path))
                        if img.endswith('.webp')
                    ]
                    project["image_count"] = len(project["images"])
                else:
                    project["images"] = []
            else:
                project["images"] = []

            project["id"] = project.get('title', "").lower().replace(" ", "-")
            stack = project.get("stack", [])
            if stack:
                project["stack"] = [
                    {
                        "name": item,
                        "icon": stack_icons.get(item)
                    } for item in stack
                ]

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "profile": profile,
            "projects": projects,
            "page": page
        }
    )
