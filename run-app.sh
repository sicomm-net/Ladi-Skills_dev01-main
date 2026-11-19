#!/bin/bash
# export NODE_ENV="production"                                                          # .(60921.02.1 RAM Set it)
  export NODE_ENV="development"                                                         # .(60921.02.2 RAM Set it)

  nPrj=50
  nStg=0; if [ "${NODE_ENV}" == "production" ]; then nStg=1; fi                         # .(61103.02.1 RAM let getStgNo set it).(60921.02.2 RAM Use it)
# ---------------------------------------------------

  function Help() {
     echo -e "\n  Run Client and/or Server App(s) for Project 61"
     echo -e   "  Usage: run-app [c|s|a]{nStg}{nApp} [-b] [-q]"
     echo -e   ""
     echo -e   "    c|s|a = c)Client, s)Server, or a)both"
     echo -e   "    nStg  = Stage: 1)Prod1, 2)Test2, 3)Dev03, 4-9)Dev0[4-9]"
     echo -e   "    nApp  = [0-9][0-9]: client#/c#%, server#/s#%, or both/a#%"
     echo -e   "     -b   = Debug, -q = Quietly, -d do npm install"
     echo -e   ""
     echo -e   "  Example: run-app a01  # runs both Client and Server App No. 01"
     echo -e   "     Runs: Server API on Port 61351 and Client App on Port 61301"
     if [ "${OS:0:3}" != "Win" ]; then echo ""; fi
     }
  if [ "$1" == "" ]; then Help; exit; fi

# ---------------------------------------------------

  aQuiet=""; if [ "$2" == "-q" ]; then aQuiet="--quiet"; set -- "$1" "${@:3}"; fi
             if [ "$3" == "-q" ]; then aQuiet="--quiet"; fi

# ---------------------------------------------------

  aRootDir="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  aStage="$(basename "${aRootDir}")"
  export PATH="/usr/bin:${aRootDir}/client/node_modules/.bin:${PATH}"

# Batch launch (RUNAPP_NOWAIT=1) silences node output so it doesn't spill onto
# the returned prompt. A normal single run leaves output on the terminal.
  aRedir=""; if [ "${RUNAPP_NOWAIT}" == "1" ]; then aRedir=">/dev/null 2>&1"; fi   # .(60920.01.1 RAM)

function checkFW() {
    bOK="$( sudo ufw status | awk '/'$1'/ { print 1 }; END { print 0 }' )"
    if [ "${bOK}" == "0" ]; then sudo ufw allow $1/tcp > /dev/null 2>&1;
#                                sudo ufw delete allow 54332/tcp
    echo "    Opened firewall for port: $1"
    fi
    }
# ---------------------------------------------------

# Function to kill process on a specific port (Windows, macOS, Linux)
function chkPort() {
    local port=$1
    echo -e "\n-----------------------------------------------------------------------------------------------------"
    echo -e "\n  Checking port $port..."

    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" || "${OS}" == Windows* ]]; then
        # Windows (Git Bash, MSYS2, Cygwin)
        local pid=$(netstat -ano 2>/dev/null | grep ":${port} " | grep "LISTENING" | awk '{print $5}' | head -1)
        if [ ! -z "$pid" ] && [ "$pid" != "0" ]; then
            echo "  Killing Windows process $pid on port $port"
            MSYS2_ARG_CONV_EXCL="/PID;/F" /c/Windows/System32/taskkill.exe /PID $pid /F 2>/dev/null | awk '{ print "  " $0 }'
        fi
    elif command -v lsof &>/dev/null; then
        # macOS or Linux with lsof
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo "  Killing process $pid on port $port"
            kill -9 $pid 2>/dev/null
        fi
    elif command -v ss &>/dev/null; then
        # Linux without lsof (use ss + awk)
        local pid=$(ss -tlnp 2>/dev/null | grep ":${port} " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1)
        if [ ! -z "$pid" ]; then
            echo "  Killing process $pid on port $port"
            kill -9 $pid 2>/dev/null
        fi
    elif command -v fuser &>/dev/null; then
        # Linux fallback with fuser
        local pid=$(fuser ${port}/tcp 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo "  Killing process $pid on port $port"
            kill -9 $pid 2>/dev/null
        fi
    else
        echo "  Warning: cannot check port $port (no lsof, ss, or fuser found)"
    fi
}
# ---------------------------------------------------

function setPort() { # $1 = 3201, 3251 or 64361: Proj#: 3,64; Stage#: 1)Prod, 2)Test, 3)Dev3, 4-9)Dev4-9; Client#/Server#: 0-4/5-9; App#: 1-9
    csn=${1:1:1}     # Client#/Server#
    ano=${1:2:1}     # App#
    pno="${2:0:2}"; if [ "${#2}" == "5" ]; then pno="${2:0:3}"; fi  # Proj#
    nsp=5;       if [ "${1:0:1}" == "c" ]; then nsp=0; fi
    nPort="${pno}$(( nsp + csn ))${ano}";
    aApp="${1:0:1}${csn}${ano}"
    aServer="server${csn}"; if [ "${csn}" == "0" ]; then aServer="server"; fi
    aClient="client${csn}"; if [ "${csn}" == "0" ]; then aClient="client"; fi
#   echo "--nPort: ${nPort}"
    }
# ---------------------------------------------------

function getPrjNo() {
    while IFS= read -r aLine; do
    aVal="${aLine:15}";  aVal="${aVal// /}"; aVal="${aVal//\"/}"
    aVar="${aLine// /}"; aVar="${aVar:0:10}"
#   echo "Looking for:   'PROJECT_NO' in '${aVar}' <- '${aVal}'"
    if [ "PROJECT_NO" == "${aVar}" ]; then nPrj="${aVal}"; break; fi
    done <<< "${mFVARS}"
#   echo "-- found: nPrj: ${nPrj}"
    }
# ---------------------------------------------------

function getStgNo() {
    aStg="${aStage}"; if [ "${nStg}" != "" ]; then return; else nStg=4; fi      # .(60819.05.1 RAM)
    while IFS= read -r aLine; do
    aVal="${aLine:17}";  aVal="${aVal// /}"; aVal="${aVal//\"/}"
    aVar="${aLine// /}"; aVar="${aVar:0:13}"
#   echo "Looking for:   'PROJECT_STAGE' in '${aVar}' <- '${aVal}'"
    if [ "PROJECT_STAGE" == "${aVar}" ]; then aStg="${aVal}"; break; fi
    done <<< "${mFVARS}"
    aStg="$( echo "${aStg}" | tr '[:upper:]' '[:lower:]' )"
    if [[ "${aStg}" =~ ^prod ]]; then nStg=1; fi
    if [[ "${aStg}" =~ ^test ]]; then nStg=2; fi
    if [[ "${aStg}" =~ ^dev  ]]; then nStg=3; fi
    if [[ "${aStg}" =~ ^app  ]]; then nStg=3; fi                                # .(60819.03.1 RAM ?? )
#   echo "-- found: nStg: ${nStg}) ${aStg} (${aStage})"; # exit
    }
# ---------------------------------------------------

function getScriptName() {                                                      # .(60819.02.1 Beg)
    aANo="$1"; aScript="$2"
 #  echo "${aANo}_${aScript}.mjs"
    if [ -f "${aScript}.js"          ]; then echo "${aScript}.js";          return; fi
    if [ -f "${aScript}.cjs"         ]; then echo "${aScript}.cjs";         return; fi
    if [ -f "${aScript}.mjs"         ]; then echo "${aScript}.mjs";         return; fi
    if [ -f "${aANo}_${aScript}.js"  ]; then echo "${aANo}_${aScript}.js";  return; fi
    if [ -f "${aANo}_${aScript}.cjs" ]; then echo "${aANo}_${aScript}.cjs"; return; fi
    if [ -f "${aANo}_${aScript}.mjs" ]; then echo "${aANo}_${aScript}.mjs"; return; fi
    }                                                                           # .(60819.02.1 End)
# ---------------------------------------------------

function setDataDir() { aDir=""
    while IFS= read -r aLine; do
    aVal="${aLine:17}";  aVal="${aVal// /}"; aVal="${aVal//\"/}"
    aVar="${aLine// /}"; aVar="${aVar:0:11}"
#  echo "Looking for:   'DATA_FOLDER' in '${aVar}' <- '${aVal}'"
    if [ "DATA_FOLDER" == "${aVar}" ]; then aDir="${aVal}"; break; fi
    done <<< "${mFVARS}" ; if [ "${aDir}" == "" ]; then return; fi
    aDir="$( echo "${aDir}" | tr '[:upper:]' '[:lower:]' )"
    aDir="${aDir/\{projectdir\}/${aRootDir}}"
#   echo "* Checking: DATA_FOLDER: '${aDir}/sources'"; # exit
    if [  ! -d "${aDir}/sources" ]; then mkdir -p "${aDir}/sources";
    echo "[]" >"${aDir}/documents.json";
    echo "* DATA_FOLDER Created: '${aDir}/sources'"
    fi
    }

function getAppName() {
   aAppName="Unknown"; setPort "$1" "$2"; aFldr="docs"
if [ "${1:0:1}" == "c" ]; then aFldr="${aClient}"; fi
if [ "${1:0:1}" == "s" ]; then aFldr="${aServer}"; fi

# Handle specific app names for docs-viewer apps
# if [ "${aApp}" == "s01" ]; then aAppName="s01_docs-viewer-api"; fi
# if [ "${aApp}" == "s02" ]; then aAppName="s02_docs-viewer-api"; fi
# if [ "${aApp}" == "c01" ]; then aAppName="c01_docs-viewer-app"; fi
# if [ "${aApp}" == "c02" ]; then aAppName="c02_docs-viewer-app"; fi
# echo "   find \"./${aFldr}\" -maxdepth 1 -type d -name \"${aApp}[-_]*\""

if [ -d "${aFldr}" ] && [ "${aAppName}" == "Unknown" ]; then
#  aAppName=$(  find "./${aFldr}" -maxdepth 1 -type d -name "${aApp}[-_]*" )                                                          # .(60819.04.1 RAM Look for ${aApp}- too)
#  aAppName=$(  find "./${aFldr}" -maxdepth 1 -type d -name "${aApp}[-_]*" | awk '!/_[vu]/      { sub( /.+\//, "" ); print; exit }' ) # .(60819.04.2 RAM Exclude ${aApp}_Name_[vu])
   aAppName=$(  find "./${aFldr}" -maxdepth 1 -type d -name "${aApp}[-_]*" | awk '!/_[vu][0-9]/ { sub( /.+\//, "" ); print; exit }' ) # .(61016.04.3 RAM Exclude ${aApp}_Name_[vu][0-9])
   fi
   }
# ---------------------------------------------------

function runServer() {
    setPort "$1" "$2"  # Sets aServer, aApp and nPort
    chkPort ${nPort}   # Kill any existing processes on our ports
    getAppName $1 $2;  # echo "-- Server Port: ${nPort} for ${aAppName}"; return

    cd ${aServer}                                                               # .(61025.10.1 RAM Moved up here)
#   Install dependencies if needed
    bDoit="0"; if [ "${3:0:2}" == "-d" ]; then bDoit="1"; fi
 if [ ! -d "node_modules"   ]; then bDoit="1"; fi                               # .(61025.10.2 RAM Remove ${aServer}/node_modules})
 if [ -f package.json ] && jq -e '((.dependencies // {}) | length) + ((.devDependencies // {}) | length) > 0' package.json >/dev/null; then bHasDependencies=1; fi  # .(61018.01.1 RAM)
 if [ "${bDoit}" == "1" ] && [ "${bHasDependencies}" == "1" ]; then                                                                                                 # .(61018.01.2)

    echo -e "\n  Installing ${aServer} dependencies..."
    npm install
#   cd ..                                                                       ##.(61025.10.3)
    fi
 if [ "$(command -v nodemon)" == "" ]; then npm install -g nodemon >/dev/null 2>&1; fi

    echo -e "\n  Starting server, ${aAppName}, on port ${nPort} ..."
#   cd ${aServer}/${aApp}_*
#   cd ${aServer}/${aAppName}                                                   ##.(61025.10.4)
    cd ${aAppName}                                                              # .(61025.10.4 RAM Remove ${aServer}/${aAppName})
#   node server.mjs &

    aScript=$( getScriptName "$1" "server" )                                    # .(60819.02.2)
#   echo "--- aScript Name: ${aScript}"; exit

    eval "node --trace-deprecation ${aQuiet} ${aScript} ${aRedir} &"            # .(60920 RAM aRedir empty unless batch)
    export SERVER_PORT=${nPort}                                                 # .(60826.02.1 RAM)

    SERVER_PID=$!
    echo -e "  Server is running at: http://localhost:${nPort}/api\n"
  # if [ "${aQuiet}" == "" ]; then echo ""; fi
    cd ../..
    }
# ---------------------------------------------------

function runClient() {
    setPort "$1" "$2"  # Sets aClient, aApp and nPort
    chkPort ${nPort}   # Kill any existing processes on our ports

    getAppName $1 $2;  # echo "- Client Stage: ${aClient} on Port: ${nPort} for AppName: ${aAppName}"; return

    cd ${aClient}                                                               # .(61025.10.5)
#   Install dependencies if needed
    bDoit="0"; if [ "${3:0:2}" == "-d" ]; then bDoit="1"; fi
 if [ ! -d "node_modules"   ]; then bDoit="1"; fi; bHasDependencies=0                                                                                               # .(61110.01.1 RAM).(61025.09.6 RAM Remove ${aClient}/node_modules})
 if [ -f package.json ] && jq -e '((.dependencies // {}) | length) + ((.devDependencies // {}) | length) > 0' package.json >/dev/null; then bHasDependencies=1; fi  # .(61018.01.3)
 if [ "${bDoit}" == "1" ] && [ "${bHasDependencies}" == "1" ]; then                                                                                                 # .(61018.01.4)

    echo -e "\n  Installing ${aClient} dependencies..."
#   cd ${aClient}                                                               ##.(61025.10.5)
    npm install
#   cd ..                                                                       ##.(61025.10.7)
    fi

 if [ "$(command -v live-server)" == "" ]; then npm install -g live-server >/dev/null 2>&1; fi

    echo -e "\n  Starting client, ${aAppName}, on port ${nPort} ..."
#   cd ${aClient}/${aApp}_*
#   cd ${aClient}/${aAppName}                                                   ##.(61025.10.8)
    cd ${aAppName}                                                              # .(61025.10.8 RAM Remove ${aClient}/${aAppName})

#   npx http-server@latest -p ${nPort} -s &
#   python -m SimpleHTTPServer
#   npx -q serve -p ${nPort} -s &

    # If a server script exists, run with node; otherwise use live-server
    aClientScript=$( ls *client.mjs 2>/dev/null | head -1 )
    if [ ! -z "${aClientScript}" ]; then
        aServ="node server"                                                     # .(61025.09.1 RAM)
        eval "CLIENT_PORT=${nPort} node ${aQuiet} ${aClientScript} ${aRedir} &"
    else
        aServ="live-server"                                                     # .(61025.09.2)
#       npx http-server@latest -p ${nPort} -s &
#       python -m SimpleHTTPServer
#       npx -q serve -p ${nPort} -s &
#       echo "  Running: live-server --port=${nPort}"
        aNoBrowser=""; if [ "${RUNAPP_NOWAIT}" == "1" ]; then aNoBrowser="--no-browser"; fi
        eval "live-server ${aQuiet} ${aNoBrowser} --port=${nPort} --watch=.,../../${aServer}/${aServerName} ${aRedir} &"
    fi
    export CLIENT_PORT=${nPort}                                                 # .(60826.02.2 RAM)

    CLIENT_PID=$!
    echo "  Client is running ${aServ} at: http://localhost:${nPort}"
    cd ../..
    }
# -------------------------------------------------
#                                  mFVARS=$( cat  _config.yaml );  echo "${mFVARS}" }   ##.(60819.02.1 RAM )
#   if [ -f "_config.js"   ]; then mFVARS=$( cat "_config.js"   ); echo "${mFVARS}";
# elif [ -f "_config.yaml" ]; then mFVARS=$( cat "_config.yaml" ); echo "${mFVARS}"; fi ##.(60819.02.1 RAM it's in aRootDir ??? ).(61025.09.1 GGY ???)
    getPrjNo; getStgNo;  # setDataDir                                             # .(61109.0-1.1 RAM No reason to set create it here)
    nPort="${nPrj}${nStg}##"
    getAppName "s${1:1:2}" ${nPort}; aServerName=${aAppName}
#   echo "  Starting ${aAppName}"; # exit

 if [ "${1:0:1}" == "s" ] || [ "${1:0:1}" == "a" ]; then
    runServer "s${1:1:2}" ${nPort} $2
    sleep 6  # Wait for server to start
    fi
 if [ "${1:0:1}" == "c" ] || [ "${1:0:1}" == "a" ]; then
    runClient "c${1:1:2}" ${nPort} $2
    fi
# ---------------------------------------------------

 if [ "${RUNAPP_NOWAIT}" == "1" ]; then                                         # .(60920 RAM batch-launch: start & return, don't block)
 #  echo -e "\n  Started (RUNAPP_NOWAIT) — returning so the next app can launch.\n"
    :
 else
    echo -e "\n\033[1;31m* Press Ctrl+C to stop one or both services!\033[0m\n"
#   Wait for user interrupt
    trap "kill $SERVER_PID $CLIENT_PID; exit" INT
    wait
 fi