#!/bin/bash
set -e

# Auto-detect JAVA_HOME if not set
if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    echo "Using JAVA_HOME: $JAVA_HOME"
else
    # Try from PATH
    JAVA_BIN=$(command -v java 2>/dev/null || true)
    if [ -n "$JAVA_BIN" ]; then
        JAVA_HOME=$(readlink -f "$JAVA_BIN" | sed 's|/bin/java||')
        export JAVA_HOME
        echo "Detected JAVA_HOME from PATH: $JAVA_HOME"
    else
        # Try VS Code / Windsurf extension JRE
        VSCODE_JAVA=$(find "$HOME/.antigravity-server" -path "*/bin/java" 2>/dev/null | head -1)
        if [ -n "$VSCODE_JAVA" ]; then
            JAVA_HOME=$(dirname "$(dirname "$VSCODE_JAVA")")
            export JAVA_HOME
            echo "Detected JAVA_HOME from IDE extension: $JAVA_HOME"
        else
            echo "ERROR: Java not found."
            echo "Please install JDK 17+ and ensure 'java' is in your PATH,"
            echo "or set JAVA_HOME manually before running this script."
            echo "  export JAVA_HOME=/path/to/your/jdk"
            exit 1
        fi
    fi
fi

# Verify Java version
JAVA_VERSION=$("$JAVA_HOME/bin/java" -version 2>&1 | head -1)
echo "Java: $JAVA_VERSION"

# Kill any existing process on port 8080
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "Stopping existing process on port 8080..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Change to script directory and start
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
./mvnw spring-boot:run "$@"
