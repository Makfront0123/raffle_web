#!/usr/bin/env sh

set -e

host="$1"
shift
cmd="$@"

echo "⏳ Waiting for $host..."

until nc -z $host 3306; do
  sleep 2
done

echo "✅ MySQL is ready"
exec $cmd
