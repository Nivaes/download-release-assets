# Get Version Action

A GitHub Action which extracts the version from `github.ref`.

Finally, you can reliably get the pushed version on every platform.

## Outputs

### `version`

The pushed version. If `github.ref` was `/refs/tags/v2.6.24` or `refs/tags/2.6.24` then the value of this output will be `2.6.24`.

## Example usage

````YML
steps:
    - id: get_version
      uses: battila7/get-version-action@v1

    - run: echo ${{ steps.get_version.outputs.version }}

````
