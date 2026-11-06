#!/bin/sh

usage() {
  printf "Usage: ii <cmd> [OPTIONS]\n"
  printf "  Commands:\n"
  printf "    build       Build Site\n"
  printf "    clean       Clean build\n"
  printf "    publish     Publish site\n"
  printf "    r           Post to r\n"
  printf "    l           List entries\n"
}

if [ $# -eq 0 ]; then
  echo "Missing arguments"
  exit 1
fi

# if [ ! -d public ]; then
#     echo "Nothing to clean"
#     exit 1
# fi

# build() {
#     npm run build
#     exit $?
# }

while true; do
  case "$1" in
  build)
    npm run build
    exit $?
    ;;
  clean)
    npm run clean
    exit $?
    ;;
  publish)
    if [ ! -d public ]; then
      echo "Not build yet"
      exit 1
    fi
    scripts/deploy.sh
    exit $?
    ;;
  r)
    printf "TODO: post to r\n"
    exit 0
    ;;
  help)
    usage
    exit 0
    ;;
  # update)
  #   echo "TODO"
  #   exit 1
  #   ;;
  *)
    echo "Unknown command: $1"
    exit 1
    ;;
  esac
done
