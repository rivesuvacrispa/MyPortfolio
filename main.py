from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json
import os

from starlette.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

PROFILE_JSON = "content/en/profile.json"
CONTACTS_JSON = "content/en/contacts.json"
PROJECTS_JSON = "content/en/projects.json"

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
    "RestoFrontAPI 8": "fas fa-code"
}


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    profile = {}
    if os.path.exists(PROFILE_JSON):
        with open(PROFILE_JSON, 'r', encoding='utf-8') as f:
            profile = json.load(f)

    contacts = {}
    if os.path.exists(CONTACTS_JSON):
        with open(CONTACTS_JSON, 'r', encoding='utf-8') as f:
            contacts = json.load(f)

    projects = []
    if os.path.exists(PROJECTS_JSON):
        with open(PROJECTS_JSON, 'r', encoding='utf-8') as f:
            projects = json.load(f)

        for project in projects:
            pictures_folder = project.get("pictures", "")
            if pictures_folder:
                picture_path = f"static/pictures/{pictures_folder}"
                if os.path.exists(picture_path):
                    project["images"] = [
                        f"/static/pictures/{pictures_folder}/{img}"
                        for img in sorted(os.listdir(picture_path))[:6]
                        if img.endswith(('.jpg', '.jpeg', '.png', '.gif'))
                    ]
                    project["image_count"] = len(project["images"])
                else:
                    project["images"] = []
            else:
                project["images"] = []

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
            "contacts": contacts,
            "projects": projects
        }
    )
