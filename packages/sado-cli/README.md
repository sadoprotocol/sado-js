# Sado Protocol CLI

Command line interface tools enabling end users to interact with the [Sado Protocol](https://sado.space) API through the Sado SDK.

## Dependencies

Sado Protocol CLI is installed through NPM and requires that you have Node.js installed on your system.

```sh
$ npm i -g @sadoprotocol/cli
```

## Commands

Once installed you can start interacting with the Sado Protocol API through our CLI commands.

### IPFS

#### ipfs.order :cid

Fetches a sado order data from the IPFS network by its CID. If the data pulled from IPFS is not a valid order object the command will fail.

```sh
$ sado ipfs.order QmWt....RktL
```

#### ipfs.offer :cid

Fetches a sado offer data from the IPFS network by its CID. If the data pulled from IPFS is not a valid offer object the command will fail.

```sh
$ sado ipfs.offer QmWt...DV8z
```
