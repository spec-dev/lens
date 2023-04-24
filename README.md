# Lens Live Objects

Live Objects on Spec for the [Lens Protocol](https://lens.xyz).

### Collect

A Collect NFT on the Lens Protocol. [[spec](Collect/spec.ts)]

```typescript
interface Collect {
    profileId: number
    pubId: number
    collectNftId: number
    collectorAddress: Address
    createdAt: Timestamp
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, pubId, collectNftId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.CollectNFTTransferred`

### Comment

A Comment on the Lens Protocol. [[spec](Comment/spec.ts)]

```typescript
interface Comment {
    profileId: number
    pubId: number
    toProfileId: number
    toPubId: number
    contentUri: string
    collectModule: Address
    collectModuleReturnData: string
    referenceModule: Address
    referenceModuleData: string
    referenceModuleReturnData: string
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, pubId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.CommentCreated`

### Follow

A Follow NFT on the Lens Protocol. [[spec](Follow/spec.ts)]

```typescript
interface Follow {
    profileId: number
    followNftId: number
    followerAddress: Address
    createdAt: Timestamp
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, followNftId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.FollowNFTTransferred`

### Mirror

A Mirror on the Lens Protocol. [[spec](Mirror/spec.ts)]

```typescript
interface Mirror {
    profileId: number
    pubId: number
    toProfileId: number
    toPubId: number
    referenceModule: Address
    referenceModuleData: string
    referenceModuleReturnData: string
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, pubId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.MirrorCreated`

### Post

A Post on the Lens Protocol. [[spec](Post/spec.ts)]

```typescript
interface Post {
    profileId: number
    pubId: number
    contentUri: string
    collectModule: Address
    collectModuleReturnData: string
    referenceModule: Address
    referenceModuleReturnData: string
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, pubId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.PostCreated`

### Profile

A Profile NFT on the Lens Protocol. [[spec](Profile/spec.ts)]

```typescript
interface Project {
    profileId: number
    ownerAddress: Address
    creatorAddress: Address
    dispatcherAddress: Address
    handle: string
    imageUri: string
    followModuleAddress: Address
    followModuleReturnData: string
    followNftUri: string
    isDefault: boolean
    createdAt: Timestamp
    blockHash: BlockHash
    blockNumber: BlockNumber
    blockTimestamp: Timestamp
    chainId: ChainId
}
```
* **Unique By**: `(profileId, chainId)`
* **Chains**: 137
* **Affected By**:
    * `lens.LensHubProxy.ProfileCreated`
    * `lens.LensHubProxy.DispatcherSet`
    * `lens.LensHubProxy.ProfileImageURISet`
    * `lens.LensHubProxy.FollowModuleSet`
    * `lens.LensHubProxy.FollowNFTURISet`
    * `lens.LensHubProxy.DefaultProfileSet`

# Developing & Testing Locally

To test the live objects locally, first make sure the following requirements are met/installed.

### Requirements

* Node.js >= 16
* Deno >= 1.3 (+recommend the Deno/Denoland VSCode extension)
* Postgres >= 14
* Spec CLI

### Setup

1) Install the Spec CLI:

```bash
$ npm install -g @spec.dev/cli
```

2) Login to your account:

```bash
$ spec login
```

3) Make sure one of your Spec projects has been set as the *current* one (Spec just needs to use one of your project's api keys when subscribing to input events during testing).

```bash
$ spec use project <org>/<name>
```

4) Make sure your local postgres instance is running on localhost:5432

### Testing Live Objects

Testing all live objects in this folder should be as easy as running:

```bash
$ spec test objects .
```