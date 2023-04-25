import { downloadExecutable } from "./yt-dlp-utils";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import prism from "prism-media";
import { resolve } from "node:path";
import { Server } from "node:https";
import module from "node:module";

const ensureEnv = arr => arr.every(x => process.env[x] !== undefined);

const isGlitch = ensureEnv([
    "PROJECT_DOMAIN",
    "PROJECT_INVITE_TOKEN",
    "API_SERVER_EXTERNAL",
    "PROJECT_REMIX_CHAIN"
]);

const isReplit = ensureEnv([
    "REPLIT_DB_URL",
    "REPL_ID",
    "REPL_IMAGE",
    "REPL_LANGUAGE",
    "REPL_OWNER",
    "REPL_PUBKEYS",
    "REPL_SLUG"
]);

const isGitHub = ensureEnv([
    "GITHUB_ENV",
    "GITHUB_REPOSITORY_OWNER",
    "GITHUB_HEAD_REF",
    "GITHUB_API_URL",
    "GITHUB_REPOSITORY",
    "GITHUB_SERVER_URL"
]);

function npmInstall(deleteDir = false, forceInstall = false, additionalArgs = []) {
    if (deleteDir) {
        const modulesPath = resolve(process.cwd(), "node_modules");

        if (existsSync(modulesPath)) {
            rmSync(modulesPath, {
                recursive: true,
                force: true
            });
        }
    }

    execSync(`npm install${isGlitch ? " --only=prod" : ""}${forceInstall ? " --force" : ""} ${additionalArgs.join(" ")}`);
}

if (isGlitch) {
    const gitIgnorePath = resolve(process.cwd(), ".gitignore");
    try {
        const data = readFileSync(gitIgnorePath, "utf8").toString();
        if (data.includes("dev.env")) {
            writeFileSync(gitIgnorePath, data.replace("\ndev.env", ""));
            console.info(" dev.env suprimé de .gitignore");
        }
    } catch {
        console.error("impossible de supprimer dev.env de .gitignore");
    }

    try {
        console.info("[INFO] Tentative de réinstalation des modules...");
        npmInstall();
        console.info("[INFO] les modules ont été réinstallé avec success.");
    } catch (err) {
        console.info("[INFO] erreur lors de la réinstalation des modules, essayez de supprimer node_modules et de ré-installer...");
        try {
            npmInstall(true);
            console.info("[INFO] Les modules ont été réinstallé avec succes .");
        } catch {
            console.info("[INFO] erreur lors de la réinstalation des modules, essayez de supprimer node_modules et d'installer les modules de force...");
            try {
                npmInstall(true, true);
                console.info("[INFO] les modules ont été réinstallé avec success.");
            } catch {
                console.warn("[WARN] erreur lors de la réinstalation des modules, essayez de les réinstaler manuelement.");
            }
        }
    }
}

if (isGitHub) {
    console.warn("[WARN] Demarer ce bot avec GitHub n'est pas recommandé.");
}

const require = module.createRequire(import.meta.url);

try {
    prism.FFmpeg.getInfo(true);
} catch {
    console.info("[INFO]  FFmpeg/avconv est introuvable, yume essaye d'installer ffmpeg-static...");
    npmInstall(false, false, ["--no-save", "ffmpeg-static"]);
    console.info("[INFO] yumé a installé ffmpeg-static :D .");
}

if (isGlitch || isReplit) {
    new Server((req, res) => {
        const now = new Date().toLocaleString("en-US");
        res.end(`OK (200) - ${now}`);
    }).listen(Number(process.env.PORT || 3000) || 3000);

    console.info(`[INFO] ${isGlitch ? "Glitch" : "Replit"} environement détécté, essai de compilation...`);
    execSync(`npm run compile`);
    console.info("[INFO] Complié avec succes.");
}

const streamStrategy = process.env.STREAM_STRATEGY;
if (streamStrategy !== "play-dl") await downloadExecutable();
if (streamStrategy === "play-dl") {
    try {
        require("play-dl");
    } catch {
        console.info("[INFO] yume installe play-dl...");
        npmInstall(false, false, ["play-dl"]);
        console.info("[INFO] yume a installé Play-dl !");
    }
}
console.info("[INFO] Demarage de Yume...");
import("./dist/index.js");
