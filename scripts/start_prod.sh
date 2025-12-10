#!/bin/bash

# Insight Web New 生产环境部署脚本
# 在服务器上直接运行，用于拉取代码、构建和启动服务

set -e

# 配置变量
PROJECT_DIR="/opt/insight-web-new"
PROJECT_NAME="insight-web-new"
PORT=3000
LOG_DIR="${PROJECT_DIR}/logs"
PID_FILE="${PROJECT_DIR}/${PROJECT_NAME}.pid"
NPM_REGISTRY="https://registry.npmmirror.com"
NODE_VERSION="20"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if [ -f /etc/debian_version ]; then
            DISTRO="debian"
        elif [ -f /etc/redhat-release ]; then
            DISTRO="redhat"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        log_error "Unsupported OS: $OSTYPE"
        exit 1
    fi
    log_info "Detected OS: ${OS}"
}

# 安装系统依赖
install_system_dependencies() {
    log_step "Installing system dependencies..."
    
    if [ "$OS" == "linux" ]; then
        if [ "$DISTRO" == "debian" ]; then
            sudo apt-get update -qq
            sudo apt-get install -y curl git build-essential > /dev/null 2>&1
        elif [ "$DISTRO" == "redhat" ]; then
            sudo yum install -y curl git gcc-c++ make > /dev/null 2>&1
        fi
    elif [ "$OS" == "macos" ]; then
        if ! command -v brew &> /dev/null; then
            log_info "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install curl git 2>/dev/null || true
    fi
    
    log_info "✓ System dependencies installed"
}

# 加载 nvm（在所有需要的地方调用）
load_nvm() {
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
        return 0
    fi
    return 1
}

# 添加路径到 PATH 环境变量
add_to_path() {
    local PATH_TO_ADD="$1"
    local TARGET_FILE="$2"
    
    if [ -z "$PATH_TO_ADD" ] || [ ! -d "$PATH_TO_ADD" ]; then
        return 1
    fi
    
    # 检查路径是否已经在文件中
    if [ -f "$TARGET_FILE" ] && grep -q "export PATH.*$PATH_TO_ADD" "$TARGET_FILE"; then
        return 0
    fi
    
    # 添加到文件
    if [ -f "$TARGET_FILE" ]; then
        if ! grep -q "export PATH.*$PATH_TO_ADD" "$TARGET_FILE"; then
            echo '' >> "$TARGET_FILE"
            echo "# Add $PATH_TO_ADD to PATH (added by insight-web-new start script)" >> "$TARGET_FILE"
            echo "export PATH=\"\$PATH:$PATH_TO_ADD\"" >> "$TARGET_FILE"
            return 0
        fi
    elif [ -w "$(dirname "$TARGET_FILE")" ] 2>/dev/null; then
        # 文件不存在但目录可写，创建文件
        echo "# Add $PATH_TO_ADD to PATH (added by insight-web-new start script)" >> "$TARGET_FILE"
        echo "export PATH=\"\$PATH:$PATH_TO_ADD\"" >> "$TARGET_FILE"
        return 0
    fi
    
    return 1
}

# 安装 nvm 和 Node.js
install_node() {
    log_step "Installing Node.js..."
    
    # 先尝试加载已存在的 nvm
    if load_nvm; then
        if command -v node &> /dev/null; then
            NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
            if [ "$NODE_VER" == "${NODE_VERSION}" ]; then
                log_info "Node.js ${NODE_VERSION} already installed: $(node -v)"
                # 即使已安装，也要确保路径在 PATH 中
                ensure_paths_in_shell_config
                return
            else
                log_warn "Node.js version mismatch. Expected ${NODE_VERSION}, got ${NODE_VER}"
            fi
        fi
    fi
    
    # 安装 nvm
    if [ ! -d "$HOME/.nvm" ]; then
        log_info "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        
        # 重新加载 nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    else
        # 加载已存在的 nvm
        load_nvm
    fi
    
    # 确定 shell 配置文件
    SHELL_CONFIG="$HOME/.bashrc"
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_CONFIG="$HOME/.zshrc"
    fi
    
    # 确保 nvm 在 shell 配置中
    if [ -f "$SHELL_CONFIG" ] && ! grep -q "NVM_DIR" "$SHELL_CONFIG"; then
        echo '' >> "$SHELL_CONFIG"
        echo '# NVM' >> "$SHELL_CONFIG"
        echo 'export NVM_DIR="$HOME/.nvm"' >> "$SHELL_CONFIG"
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$SHELL_CONFIG"
        echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$SHELL_CONFIG"
    fi
    
    # 验证 nvm 是否可用
    if ! command -v nvm &> /dev/null && ! type nvm &> /dev/null; then
        log_error "nvm installation failed or not loaded"
        exit 1
    fi
    
    # 安装 Node.js
    log_info "Installing Node.js ${NODE_VERSION}..."
    nvm install ${NODE_VERSION}
    nvm use ${NODE_VERSION}
    nvm alias default ${NODE_VERSION}
    
    # 验证安装
    if ! command -v node &> /dev/null; then
        log_error "Node.js installation failed!"
        exit 1
    fi
    
    log_info "✓ Node.js installed: $(node -v)"
    log_info "✓ npm version: $(npm -v)"
    log_info "✓ Node.js path: $(which node)"
    log_info "✓ npm path: $(which npm)"
    
    # 确保路径在 shell 配置中
    ensure_paths_in_shell_config
}

# 确保 Node.js 和 PM2 路径在 shell 配置中
ensure_paths_in_shell_config() {
    log_step "Adding Node.js and PM2 paths to shell configuration..."
    
    # 加载 nvm 以获取 Node.js 路径
    load_nvm || true
    
    if ! command -v node &> /dev/null; then
        log_warn "Node.js not found, skipping path configuration"
        return
    fi
    
    NODE_BIN_DIR=$(dirname $(which node))
    NPM_BIN_DIR=$(dirname $(which npm))
    
    log_info "Node.js bin directory: ${NODE_BIN_DIR}"
    log_info "npm bin directory: ${NPM_BIN_DIR}"
    
    # PM2 路径
    PM2_BIN_DIR=""
    if command -v pm2 &> /dev/null; then
        PM2_BIN_DIR=$(dirname $(which pm2))
    elif command -v npm &> /dev/null; then
        NPM_PREFIX=$(npm config get prefix 2>/dev/null)
        if [ -n "$NPM_PREFIX" ] && [ -d "$NPM_PREFIX/bin" ] && [ -f "$NPM_PREFIX/bin/pm2" ]; then
            PM2_BIN_DIR="$NPM_PREFIX/bin"
        fi
    fi
    
    if [ -n "$PM2_BIN_DIR" ]; then
        log_info "PM2 bin directory: ${PM2_BIN_DIR}"
    fi
    
    # 要添加的配置文件列表
    CONFIG_FILES=()
    
    # Bash 配置文件
    CONFIG_FILES+=("$HOME/.bashrc")
    CONFIG_FILES+=("$HOME/.bash_profile")
    CONFIG_FILES+=("$HOME/.profile")
    
    # Zsh 配置文件
    CONFIG_FILES+=("$HOME/.zshrc")
    CONFIG_FILES+=("$HOME/.zprofile")
    
    # 系统级别配置文件（需要 sudo）
    if [ -w "/etc/profile.d" ] || sudo -n true 2>/dev/null; then
        SYSTEM_CONFIG="/etc/profile.d/insight-web-new-node.sh"
        CONFIG_FILES+=("$SYSTEM_CONFIG")
    fi
    
    # 添加到所有配置文件
    for CONFIG_FILE in "${CONFIG_FILES[@]}"; do
        if [ -z "$CONFIG_FILE" ]; then
            continue
        fi
        
        # 检查文件是否存在或可创建
        if [ ! -f "$CONFIG_FILE" ] && [ ! -w "$(dirname "$CONFIG_FILE")" ] 2>/dev/null; then
            # 系统级别文件需要 sudo
            if [[ "$CONFIG_FILE" == "/etc/profile.d/"* ]]; then
                if sudo -n true 2>/dev/null; then
                    sudo touch "$CONFIG_FILE" 2>/dev/null || continue
                    sudo chmod 644 "$CONFIG_FILE" 2>/dev/null || true
                else
                    log_warn "Skipping ${CONFIG_FILE} (need sudo)"
                    continue
                fi
            else
                continue
            fi
        fi
        
        ADDED_ANY=false
        
        # 添加 Node.js 路径
        if [ -n "$NODE_BIN_DIR" ] && [ -d "$NODE_BIN_DIR" ]; then
            if add_to_path "$NODE_BIN_DIR" "$CONFIG_FILE"; then
                ADDED_ANY=true
            fi
        fi
        
        # 添加 npm 路径
        if [ -n "$NPM_BIN_DIR" ] && [ -d "$NPM_BIN_DIR" ] && [ "$NPM_BIN_DIR" != "$NODE_BIN_DIR" ]; then
            if add_to_path "$NPM_BIN_DIR" "$CONFIG_FILE"; then
                ADDED_ANY=true
            fi
        fi
        
        # 添加 PM2 路径
        if [ -n "$PM2_BIN_DIR" ] && [ -d "$PM2_BIN_DIR" ]; then
            if add_to_path "$PM2_BIN_DIR" "$CONFIG_FILE"; then
                ADDED_ANY=true
            fi
        fi
        
        if [ "$ADDED_ANY" = true ]; then
            if [[ "$CONFIG_FILE" == "/etc/profile.d/"* ]]; then
                log_info "✓ Added paths to ${CONFIG_FILE} (system-wide)"
            else
                log_info "✓ Added paths to ${CONFIG_FILE}"
            fi
        fi
    done
    
    # 更新当前会话的 PATH
    if [ -n "$NODE_BIN_DIR" ] && echo "$PATH" | grep -qv "$NODE_BIN_DIR"; then
        export PATH="$PATH:$NODE_BIN_DIR"
    fi
    if [ -n "$NPM_BIN_DIR" ] && [ "$NPM_BIN_DIR" != "$NODE_BIN_DIR" ] && echo "$PATH" | grep -qv "$NPM_BIN_DIR"; then
        export PATH="$PATH:$NPM_BIN_DIR"
    fi
    if [ -n "$PM2_BIN_DIR" ] && echo "$PATH" | grep -qv "$PM2_BIN_DIR"; then
        export PATH="$PATH:$PM2_BIN_DIR"
    fi
    
    log_info "✓ Paths configured in multiple shell configuration files"
    log_info "  New shells will automatically have Node.js, npm, and PM2 in PATH"
    log_info "  For current session, paths are already added"
}

# 检查并进入项目目录
check_project_dir() {
    log_step "Checking project directory..."
    if [ ! -d "${PROJECT_DIR}" ]; then
        log_error "Project directory not found: ${PROJECT_DIR}"
        exit 1
    fi
    cd "${PROJECT_DIR}"
    log_info "Current directory: $(pwd)"
}

# 拉取最新代码
pull_latest_code() {
    log_step "Pulling latest code from git..."
    if [ ! -d ".git" ]; then
        log_error "Not a git repository!"
        exit 1
    fi
    
    # 保存当前分支
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
    log_info "Current branch: ${CURRENT_BRANCH}"
    
    # 拉取最新代码
    git fetch origin
    git pull origin "${CURRENT_BRANCH}" || {
        log_warn "Git pull failed, continuing with existing code..."
    }
    log_info "✓ Code updated"
}

# 停止当前服务
stop_service() {
    log_step "Stopping current service..."
    
    # 方法1: 使用 PID 文件
    if [ -f "${PID_FILE}" ]; then
        OLD_PID=$(cat "${PID_FILE}")
        if ps -p ${OLD_PID} > /dev/null 2>&1; then
            log_info "Stopping process (PID: ${OLD_PID})..."
            kill ${OLD_PID} 2>/dev/null || true
            sleep 2
            # 如果还在运行，强制杀死
            if ps -p ${OLD_PID} > /dev/null 2>&1; then
                kill -9 ${OLD_PID} 2>/dev/null || true
            fi
            log_info "✓ Process stopped"
        fi
        rm -f "${PID_FILE}"
    fi
    
    # 方法2: 使用 PM2（如果安装了）
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "${PROJECT_NAME}"; then
            log_info "Stopping PM2 process..."
            pm2 stop "${PROJECT_NAME}" 2>/dev/null || true
            pm2 delete "${PROJECT_NAME}" 2>/dev/null || true
            log_info "✓ PM2 process stopped"
        fi
    fi
    
    # 方法3: 查找并停止 vite preview 进程
    pkill -f "vite preview" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    sleep 1
    
    log_info "✓ Service stopped"
}

# 安装依赖
install_dependencies() {
    log_step "Installing dependencies..."
    
    # 加载 nvm（如果存在）
    load_nvm || true
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Installing..."
        install_node
        # 重新加载 nvm 确保 Node.js 可用
        load_nvm
    fi
    
    # 再次验证 Node.js 是否可用
    if ! command -v node &> /dev/null; then
        log_error "Node.js still not available after installation!"
        log_error "Please check nvm installation and try again."
        exit 1
    fi
    
    log_info "Node.js version: $(node -v)"
    log_info "npm version: $(npm -v)"
    log_info "Node.js path: $(which node)"
    
    # 设置 npm 镜像
    npm config set registry ${NPM_REGISTRY}
    
    # 安装依赖
    npm ci || npm install
    
    log_info "✓ Dependencies installed"
}

# 构建项目
build_project() {
    log_step "Building project..."
    
    # 加载 nvm（确保 Node.js 可用）
    load_nvm || true
    
    # 验证 Node.js 是否可用
    if ! command -v node &> /dev/null; then
        log_error "Node.js not available for build!"
        exit 1
    fi
    
    # 清理之前的构建
    rm -rf dist
    rm -rf dist-ssr
    rm -rf node_modules/.vite
    
    # 构建
    npm run build
    
    # 验证构建结果
    if [ ! -d "dist" ]; then
        log_error "Build failed! dist directory not found."
        exit 1
    fi
    
    log_info "✓ Build completed"
    log_info "✓ Build output: dist/"
}

# 创建日志目录
create_log_dir() {
    log_step "Creating log directory..."
    mkdir -p "${LOG_DIR}"
    chmod -R 755 "${LOG_DIR}"
    log_info "Log directory: ${LOG_DIR}"
}

# 启动服务（使用 PM2 运行 vite preview）
start_service() {
    log_step "Starting service..."
    
    # 加载 nvm（确保 Node.js 可用）
    load_nvm || true
    
    # 验证 Node.js 是否可用
    if ! command -v node &> /dev/null; then
        log_error "Node.js not available for starting service!"
        exit 1
    fi
    
    NODE_PATH=$(which node)
    NPM_PATH=$(which npm)
    log_info "Node.js path: ${NODE_PATH}"
    log_info "npm path: ${NPM_PATH}"
    log_info "Node.js version: $(node -v)"
    log_info "npm version: $(npm -v)"
    
    # 检查是否安装了 PM2
    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 not found, installing globally..."
        npm install -g pm2 || {
            log_error "Failed to install PM2"
            exit 1
        }
        # 安装后确保路径在配置中
        ensure_paths_in_shell_config
    fi
    
    PM2_PATH=$(which pm2)
    PM2_BIN_DIR=$(dirname "$PM2_PATH")
    log_info "PM2 path: ${PM2_PATH}"
    log_info "PM2 bin directory: ${PM2_BIN_DIR}"
    log_info "PM2 version: $(pm2 -v)"
    
    # 确保 PM2 路径在当前 PATH 中
    if echo "$PATH" | grep -qv "$PM2_BIN_DIR"; then
        export PATH="$PATH:$PM2_BIN_DIR"
        log_info "Added PM2 path to current session PATH"
    fi
    
    # 确保 PM2 daemon 正在运行
    log_info "Checking PM2 daemon..."
    if ! pm2 ping > /dev/null 2>&1; then
        log_info "PM2 daemon not running, starting it..."
        pm2 kill > /dev/null 2>&1 || true
        # PM2 daemon 会自动启动
    fi
    
    # 验证 PM2 daemon
    if ! pm2 ping > /dev/null 2>&1; then
        log_error "PM2 daemon failed to start!"
        log_error "Try running: pm2 kill && pm2 ping"
        exit 1
    fi
    log_info "✓ PM2 daemon is running"
    
    # 设置环境变量
    export NODE_ENV=production
    export PORT=${PORT}
    
    log_info "Environment variables:"
    log_info "  NODE_ENV=${NODE_ENV}"
    log_info "  PORT=${PORT}"
    
    # 检查项目文件
    if [ ! -f "package.json" ]; then
        log_error "package.json not found in current directory: $(pwd)"
        exit 1
    fi
    
    if [ ! -d "dist" ]; then
        log_error "dist directory not found. Please build the project first."
        exit 1
    fi
    
    # 如果应用已存在，先删除
    log_info "Checking for existing PM2 process..."
    if pm2 list | grep -q "${PROJECT_NAME}"; then
        log_info "Stopping existing process..."
        pm2 delete "${PROJECT_NAME}" > /dev/null 2>&1 || true
        sleep 1
    fi
    
    # 使用 PM2 启动服务
    log_info "Starting ${PROJECT_NAME} on port ${PORT}..."
    log_info "Working directory: $(pwd)"
    
    # 创建 PM2 ecosystem 配置文件（临时，使用 .cjs 扩展名以支持 CommonJS）
    PM2_CONFIG="${PROJECT_DIR}/pm2.config.cjs"
    cat > "${PM2_CONFIG}" <<EOF
module.exports = {
  apps: [{
    name: '${PROJECT_NAME}',
    script: 'npm',
    args: 'run preview -- --port ${PORT} --host 0.0.0.0',
    cwd: '${PROJECT_DIR}',
    interpreter: '${NODE_PATH}',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: '${PORT}'
    },
    error_file: '${LOG_DIR}/pm2-error.log',
    out_file: '${LOG_DIR}/pm2.log',
    log_file: '${LOG_DIR}/pm2-combined.log',
    merge_logs: true,
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF
    
    log_info "Starting with PM2 config..."
    pm2 start "${PM2_CONFIG}" || {
        log_error "Failed to start with config file, trying direct command..."
        # 回退到直接命令方式
        pm2 start npm --name "${PROJECT_NAME}" -- run preview -- --port ${PORT} --host 0.0.0.0 \
            --cwd "${PROJECT_DIR}" \
            --interpreter "${NODE_PATH}" \
            --log "${LOG_DIR}/pm2.log" \
            --error "${LOG_DIR}/pm2-error.log" \
            --merge-logs \
            --time || {
            log_error "Failed to start service!"
            log_error "Check logs: ${LOG_DIR}/pm2-error.log"
            exit 1
        }
    }
    
    # 清理临时配置文件
    rm -f "${PM2_CONFIG}"
    
    # 保存 PM2 配置（确保重启后自动恢复）
    pm2 save || log_warn "Failed to save PM2 configuration"
    
    # 等待一下确保服务启动
    log_info "Waiting for service to start..."
    sleep 5
    
    # 显示详细状态
    log_info "PM2 process list:"
    pm2 list
    
    # 检查进程是否在运行（使用更可靠的方法）
    log_info "Checking process status..."
    
    # 方法1: 使用 pm2 jlist 检查
    PM2_JSON=$(pm2 jlist 2>/dev/null || echo "[]")
    PM2_EXISTS=$(echo "$PM2_JSON" | grep -q "\"name\":\"${PROJECT_NAME}\"" && echo "yes" || echo "no")
    
    # 方法2: 使用 pm2 list 检查
    PM2_LIST_OUTPUT=$(pm2 list 2>/dev/null || echo "")
    PM2_IN_LIST=$(echo "$PM2_LIST_OUTPUT" | grep -q "${PROJECT_NAME}" && echo "yes" || echo "no")
    
    log_info "Process exists check: PM2_JSON=${PM2_EXISTS}, PM2_LIST=${PM2_IN_LIST}"
    
    if [ "$PM2_EXISTS" = "no" ] && [ "$PM2_IN_LIST" = "no" ]; then
        log_error "Process not found in PM2 list!"
        log_error ""
        log_error "=== Debugging Information ==="
        log_error "PM2 daemon status:"
        pm2 ping 2>&1 || log_error "PM2 daemon not responding!"
        log_error ""
        log_error "All PM2 processes:"
        pm2 list 2>&1 || true
        log_error ""
        log_error "PM2 JSON output:"
        echo "$PM2_JSON" | head -50 || true
        log_error ""
        log_error "Recent PM2 logs (all processes):"
        pm2 logs --lines 30 --nostream 2>&1 | tail -50 || true
        log_error ""
        log_error "Application-specific logs:"
        if [ -f "${LOG_DIR}/pm2-error.log" ]; then
            log_error "Error log (last 30 lines):"
            tail -30 "${LOG_DIR}/pm2-error.log" || true
        fi
        if [ -f "${LOG_DIR}/pm2.log" ]; then
            log_error "Output log (last 30 lines):"
            tail -30 "${LOG_DIR}/pm2.log" || true
        fi
        log_error ""
        log_error "Trying to get process info by name..."
        pm2 describe "${PROJECT_NAME}" 2>&1 || log_error "Cannot describe process"
        log_error ""
        log_error "=== End Debugging Information ==="
        exit 1
    fi
    
    # 验证服务是否正在运行
    PM2_STATUS=$(pm2 list 2>/dev/null | grep "${PROJECT_NAME}" || echo "")
    
    if [ -z "$PM2_STATUS" ]; then
        log_error "Process found but status unknown!"
        pm2 describe "${PROJECT_NAME}" 2>&1 || true
        exit 1
    fi
    
    # 检查状态（online, errored, stopped 等）
    if echo "$PM2_STATUS" | grep -qE "online|started"; then
        log_info "✓ Service started successfully and running in background"
        
        # 显示进程信息
        log_info "Process details:"
        pm2 describe "${PROJECT_NAME}" 2>&1 | head -30 || true
        
        # 等待一下让服务完全启动
        sleep 3
        
        # 检查端口是否在监听
        PORT_LISTENING=false
        if command -v netstat &> /dev/null; then
            if netstat -tuln 2>/dev/null | grep -q ":${PORT} "; then
                PORT_LISTENING=true
            fi
        elif command -v ss &> /dev/null; then
            if ss -tuln 2>/dev/null | grep -q ":${PORT} "; then
                PORT_LISTENING=true
            fi
        fi
        
        if [ "$PORT_LISTENING" = "true" ]; then
            log_info "✓ Port ${PORT} is listening"
        else
            log_warn "Port ${PORT} may not be listening yet (service may still be starting)"
            log_info "Check again in a few seconds with: netstat -tuln | grep ${PORT}"
        fi
        
    elif echo "$PM2_STATUS" | grep -qE "errored|stopped"; then
        log_error "Service is in error or stopped state!"
        log_error "PM2 status:"
        pm2 describe "${PROJECT_NAME}" 2>&1 || true
        log_error ""
        log_error "Recent logs:"
        pm2 logs "${PROJECT_NAME}" --lines 50 --nostream 2>&1 || true
        log_error ""
        if [ -f "${LOG_DIR}/pm2-error.log" ]; then
            log_error "Error log (last 50 lines):"
            tail -50 "${LOG_DIR}/pm2-error.log" || true
        fi
        exit 1
    else
        log_warn "Service status: ${PM2_STATUS}"
        log_info "Process details:"
        pm2 describe "${PROJECT_NAME}" 2>&1 | head -30 || true
        log_info "Recent logs:"
        pm2 logs "${PROJECT_NAME}" --lines 20 --nostream 2>&1 || true
    fi
    
    log_info ""
    log_info "Service Details:"
    log_info "  Name: ${PROJECT_NAME}"
    log_info "  Port: ${PORT}"
    log_info "  Logs: ${LOG_DIR}/pm2.log"
    log_info "  Error logs: ${LOG_DIR}/pm2-error.log"
    log_info "  Status: Running in background"
    log_info ""
    log_info "PM2 Management Commands:"
    log_info "  View logs: pm2 logs ${PROJECT_NAME}"
    log_info "  View real-time logs: pm2 logs ${PROJECT_NAME} --lines 50"
    log_info "  Stop: pm2 stop ${PROJECT_NAME}"
    log_info "  Restart: pm2 restart ${PROJECT_NAME}"
    log_info "  Status: pm2 status"
    log_info "  Monitor: pm2 monit"
    log_info "  Process info: pm2 describe ${PROJECT_NAME}"
    log_info ""
    log_info "System Process Check:"
    log_info "  ps aux | grep ${PROJECT_NAME}"
    log_info "  ps aux | grep 'vite preview'"
    log_info ""
    log_info "Note: The service is running in the background via PM2."
    log_info "It will continue running even after you exit this script."
}

# 主函数
main() {
    echo "=========================================="
    echo "  Insight Web New Production Environment"
    echo "  Deployment Script"
    echo "=========================================="
    echo ""
    
    # 检测操作系统
    detect_os
    
    # 检查并安装系统依赖和 Node.js
    # 先尝试加载已存在的 nvm
    load_nvm || true
    
    if ! command -v node &> /dev/null; then
        log_info "Node.js not found, installing..."
        install_system_dependencies
        install_node
        # 安装后重新加载 nvm
        load_nvm
    else
        log_info "Node.js found: $(node -v)"
        log_info "Node.js path: $(which node)"
        # 即使已安装，也要确保路径在配置中
        ensure_paths_in_shell_config
    fi
    
    # 最终验证 Node.js 是否可用
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not available!"
        log_error "Please check the installation and try again."
        exit 1
    fi
    
    # 确保路径在当前会话中可用
    NODE_BIN_DIR=$(dirname $(which node))
    NPM_BIN_DIR=$(dirname $(which npm))
    if echo "$PATH" | grep -qv "$NODE_BIN_DIR"; then
        export PATH="$PATH:$NODE_BIN_DIR"
        log_info "Added Node.js path to current session PATH"
    fi
    if [ "$NPM_BIN_DIR" != "$NODE_BIN_DIR" ] && echo "$PATH" | grep -qv "$NPM_BIN_DIR"; then
        export PATH="$PATH:$NPM_BIN_DIR"
        log_info "Added npm path to current session PATH"
    fi
    
    check_project_dir
    pull_latest_code
    stop_service
    install_dependencies
    build_project
    create_log_dir
    start_service
    
    echo ""
    echo "=========================================="
    log_info "Deployment completed successfully!"
    echo "=========================================="
    echo ""
    log_info "Service is running on port ${PORT}"
    log_info "Access: http://localhost:${PORT}"
    echo ""
}

# 执行主函数
main "$@"
