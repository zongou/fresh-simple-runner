# simple-runner

Run script

## Installation

Install via Fresh's package manager:

```
:pkg install simple-runner
```

Or install from this repository:

```
:pkg install https://github.com/zongou/fresh-simple-runner
```

## Usage

This plugin adds the following commands:

- `hello` - Say Hello

## License

MIT

### Load

```
Load from buffer
```

```
Run command
```

## Development

### Debug

```sh
fresh --log-file ${TMPDIR-/tmp}/a.log "$@"
```

### Log

```sh
tail -f ${TMPDIR-/tmp}/a.log  | grep -E console
```

### Check

```sh
fresh --check-plugin ./plugin.ts
```

### Update

```sh
git --git-dir=/home/user/.config/fresh/plugins/packages/simple-runner/.git pull
```
