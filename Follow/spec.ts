import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, On, SpecEvent, StringKeyMap } from 'https://esm.sh/@spec.dev/core@0.0.17'

/**
 * A Lens Follow NFT.
 */
@Spec({
    table: 'lens.follows',
    uniqueBy: ['profileId', 'followNftId', 'chainId']
})
class Follow extends LiveObject {
    // The token id of the followed profile NFT.
    @Property()
    profileId: number
    
    // The token id of the follow NFT.
    @Property()
    followNftId: number

    // The address of the follower.
    @Property()
    followerAddress: Address
    
    // The block timestamp in which the follow NFT was created.
    @Property({ update: false })
    createdAt: Timestamp

    // The block hash in which the follow NFT was last updated.
    @Property()
    blockHash: BlockHash

    // The block number in which the follow NFT was last updated.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the follow NFT was last updated.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @On('contracts.lens.LensHubProxy.FollowNFTTransferred')
    async onFollow(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this.profileId = data.profileId
        this.followNftId = data.followNFTId
        this.followerAddress = data.to
        this.createdAt = data.blockTimestamp
        this.blockHash = data.blockHash
        this.blockNumber = data.blockNumber
        this.blockTimestamp = data.blockTimestamp
        this.chainId = data.chainId
        await this.save()
    }
}

export default Follow